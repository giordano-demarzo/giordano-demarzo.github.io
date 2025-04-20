---
layout: default
title: Neural Network Regression Visualization
permalink: /teaching/deep-learning-25/shallow_nn/
---

<link rel="stylesheet" href="/assets/css/shallow_nn.css">
<script src="/assets/js/shallow_nn.js"></script>

<div class="course-page-container">
    <h1>Neural Network Regression Visualization</h1>
    <p>This interactive visualization demonstrates how a shallow neural network with ReLU activations works for regression problems.</p>
    
    <div id="network-container" class="network-container">
        <!-- Content will be inserted by JS -->
    </div>
    
    <div class="network-explanation">
        <h2>About Shallow Neural Networks</h2>
        <p>A shallow neural network extends beyond a simple perceptron by adding a hidden layer of neurons. This visualization demonstrates:</p>
        <ul>
            <li>One input feature (x)</li>
            <li>A hidden layer with adjustable number of neurons using ReLU activation</li>
            <li>One output neuron (y) that performs a weighted sum</li>
            <li>How these networks can model non-linear relationships</li>
        </ul>
        
        <p>Each neuron in the hidden layer computes: ReLU(w<sub>i</sub>x + b<sub>i</sub>)</p>
        <p>Where ReLU(z) = max(0, z) is the activation function that introduces non-linearity.</p>
        
        <h3>Network Architecture</h3>
        <p>The size of each hidden neuron visually indicates its contribution to the output. Green connections represent positive weights, while red connections represent negative weights.</p>
        
        <h3>Regression Capabilities</h3>
        <p>While a single perceptron can only fit linear functions, a neural network with at least one hidden layer can approximate any continuous function with enough neurons. This makes them powerful tools for regression tasks.</p>
        
        <h3>Mean Squared Error</h3>
        <p>The visualization shows the Mean Squared Error (MSE), which measures how well the model fits the data points. Lower MSE indicates better fit.</p>
    </div>
</div>
