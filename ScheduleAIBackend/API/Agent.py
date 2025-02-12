import os 
import numpy as np
import tensorflow as tf
import tensorflow.keras as keras
from tensorflow.keras.optimizers import Adam
from ReplayBuffer import ReplayBuffer
from Networks import ActorNetwork, CriticNetwork, ValueNetwork

#alpha and beta are learning rates
class Agent:
    def __init__(self, alpha=0.0003, beta=0.0003, input_dims=[8], env=None, gamma=0.99, n_actions=2, max_size=1000000, tau=0.005, layer1_size=256, layer2_size=256, batch_size=256, reward_scale=2):
        self.gamma = gamma
        self.tau = tau
        self.memory = ReplayBuffer(max_size, input_dims, n_actions)
        self.batch_size = batch_size
        self.n_actions = n_actions 

        self.actor = ActorNetwork(n_actions=n_actions, name='actor', max_action=env.action_space.high)
        self.critic_1 = CriticNetwork(n_actions=n_actions, name = 'critic_1')
        self.critic_2 = CriticNetwork(n_actions=n_actions, name = 'critic_2')
        self.value = ValueNetwork(name='value')
        self.target_value = ValueNetwork(name='target_value')

        self.actor.compile(optimizer=Adam(learning_rate=alpha))
        self.critic_1.compile(optimizer=Adam(learning_rate=beta))
        self.critic_2.compile(optimizer=Adam(learning_rate=beta))
        self.value.compile(optimizer=Adam(learning_rate=beta))
        self.target_value.compile(optimizer=Adam(learning_rate=beta))

        self.scale = reward_scale
        self.update_network_parameters(tau=1)

    def choose_action(self, observation):
        state = tf.convert_to_tensor([observation])
        actions,_ = self.actor.sample_normal(state, reparameterize=False)
        
        return actions[0]

    def learn(self):
        if(self.memory.m_cntr < self.batch_size):
            return 

        state, action, reward, new_state, done = self.memory.sample(self.batch_size)

        states = tf.convert_to_tensor(state, dtype=tf.float32)
        states_ = tf.convert_to_tensor(new_state, dtype=tf.float32)
        rewards = tf.convert_to_tensor(reward, dtype=tf.float32)
        actions = tf.convert_to_tensor(action, dtype=tf.float32)

        with tf.GradientTape() as tape:
            value = tf.squeeze(self.value(states), 1)
            value_ = tf.squeeze(self.target_value(states_), 1)

            current_policy_actions, log_probs = self.actor.sample_normal(states, reparameterize=False)

            log_probs = tf.squeeze(log_probs, 1)

            q1_new_policy = self.critic_1(states, current_policy_actions)
            q2_new_policy = self.critic_2(states, current_policy_actions)
            critic_value = tf.squeeze(tf.math.minimum(q1_new_policy, q2_new_policy), 1)
            value_target = critic_value - log_probs
            value_loss = 0.5 * keras.losses.MSE(value, value_target)

        value_network_gradient = tape.gradient(value_loss, self.value.trainable_variables)
        self.value.optimizer.apply_gradients(zip(
            value_network_gradient, 

            self.value.trainable_variables
        ))

        with tf.GradientTape() as tape:
            new_policy_actions, log_probs = self.actor.sample_normal(states, reparameterize=True)

            log_probs = tf.squeeze(log_probs, 1)
            q1_new_policy = self.critic_1(states, new_policy_actions)
            q2_new_policy = self.critic_2(states, new_policy_actions)
            critic_value = tf.squeeze(tf.math.minimum(q1_new_policy, q2_new_policy), 1)
            actor_loss = log_probs - critic_value 
            actor_loss = tf.math.reduce_mean(actor_loss)

        actor_network_gradient = tape.gradient(actor_loss, self.actor.trainable_variables)

        self.actor.optimizer.apply_gradients(zip(actor_network_gradient, self.actor.trainable_variables))

        with tf.GradientTape(persistent=True) as tape:
            q_hat = self.scale*reward +self.gamma*value_*(1-done)
            q1_old_policy = tf.squeeze(self.critic_1(state, action), 1)
            q2_old_policy = tf.squeeze(self.critic_2(state, action), 1)
            critic_1_loss = 0.5*keras.losses.MSE(q1_old_policy, q_hat)
            critic_2_loss = 0.5*keras.losses.MSE(q2_old_policy, q_hat)

        critic_1_network_gradient = tape.gradient(critic_1_loss, self.critic_1.trainable_variables)
        critic_2_network_gradient = tape.gradient(critic_2_loss, self.critic_2.trainable_variables)

        self.critic_1.optimizer.apply_gradients(zip(
            critic_1_network_gradient, self.critic_1.trainable_variables
        ))

        self.critic_2.optimizer.apply_gradients(zip(
            critic_2_network_gradient, self.critic_1.trainable_variables
        ))

        self.update_network_parameters()

