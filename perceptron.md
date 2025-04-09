---
layout: default
title: Perceptron Visualization Demo
permalink: /teaching/deep-learning-25/perceptron/
---

<link rel="stylesheet" href="/assets/css/perceptron.css">
<script src="/assets/js/perceptron.js"></script>

<div class="course-page-container">
    <h1>Perceptron Visualization Demo</h1>
    <p>This interactive visualization demonstrates how a perceptron with 2 inputs and 1 output works for binary classification.</p>
    
    <div id="perceptron-container" class="perceptron-container">
        <!-- Content will be inserted by JS -->
    </div>
    
    <div class="perceptron-explanation">
        <h2>About Perceptrons</h2>
        <p>A perceptron is the simplest form of a neural network. It consists of:</p>
        <ul>
            <li>Input features (in this case, x₁ and x₂)</li>
            <li>Weights (w₁ and w₂) that determine the importance of each input</li>
            <li>A bias term (b) that shifts the decision boundary</li>
            <li>An activation function (step function in this case)</li>
        </ul>
        
        <p>The perceptron computes a weighted sum of its inputs plus the bias: w₁x₁ + w₂x₂ + b</p>
        <p>Then it applies the activation function to produce an output:</p>
        <ul>
            <li>Output = 1 (red) if w₁x₁ + w₂x₂ + b ≥ 0</li>
            <li>Output = 0 (blue) if w₁x₁ + w₂x₂ + b < 0</li>
        </ul>
        
        <h3>Decision Boundary</h3>
        <p>The green line represents the decision boundary, where w₁x₁ + w₂x₂ + b = 0.</p>
        <p>This boundary is a straight line in 2D space, defined by:</p>
        <p>x₂ = (-w₁x₁ - b) / w₂</p>
        
        <h3>Limitations</h3>
        <p>Perceptrons can only learn linearly separable functions. This is why multiple perceptrons are combined in multi-layer neural networks to solve more complex problems.</p>
    </div>
</div>
