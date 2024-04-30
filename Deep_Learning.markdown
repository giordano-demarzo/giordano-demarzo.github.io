---
layout: default
title: Deep Learning
permalink: /teaching/deep-learning/
---

<div class="course-page-container">
    <h1>Deep Learning for Social Sciences</h1>
    <h4>Department of Politics and Public Administration, Konstanz University</h4>
    <h5>Summer Semester 2023/2024</h5>
    <p>This introductory course on deep learning offers a deep dive into advanced neural network architectures and their
applications to the Social Sciences. I'll co-teach this course with Prof. Max Pellert.</p>

    <!-- Contents Section -->
    <button class="accordion-button" onclick="toggleAccordion('contents-section')">Contents &#9662;</button>
    <div class="accordion-content" id="contents-section">
        <h4>Topics</h4>
    <p>This course offers a deep dive into advanced neural network architectures and their applications, including:</p>
    <ul>
        <li>Introduction to the use of deep learning techniques in social sciences</li>
        <li>Basic Machine Learning concepts: regression, classification, and models</li>
        <li>Neural Networks: Perceptrons, Multi-Layer Perceptrons, XOR problem, activation functions, backpropagation, and gradient descent</li>
        <li>Convolutional Neural Networks: Image processing implementations in PyTorch</li>
        <li>Graph Neural Networks and their Python implementations</li>
        <li>Recurrent Neural Networks and Long Short Term Memory networks for time series analysis</li>
        <li>Generative deep learning techniques</li>
        <li>Advanced topics: Diffusion Models, Reinforcement Learning, and Large Language Models based on transformer architectures like the GPT series in NLP with practical implementations in PyTorch</li>
    </ul>

    <h4>Format</h4>
    <p>The course is structured as:</p>
    <ol>
        <li>Lectures on theory of Deep Learning (14 sessions)</li>
        <li>Coding labs (13 sessions)</li>
    </ol>

    <h4>Grading</h4>
    <p>The course grade is composed of four assignments delivered during the semester (40%) and a final project (60%).</p>

    <h4>Exercises</h4>
    <p>A practical part of exercises connected to the lectures will be offered. The exercises will not be graded.</p>
    </div>
    
    <!-- Course Dates Section -->
    <button class="accordion-button" onclick="toggleAccordion('course-dates-section')">Course Dates &#9662;</button>
    <div class="accordion-content" id="course-dates-section">
        <div class="course-date">
            <span class="date">March 3, 2024</span> - <span class="lecture-title">Introduction to Computational Models</span>
        </div>
        <div class="course-date">
            <span class="date">March 10, 2024</span> - <span class="lecture-title">Agent-Based Models: Concepts and Examples</span>
        </div>
        <!-- Additional dates can be added here -->
    </div>
    <!-- Material Section -->
    <button class="accordion-button" onclick="toggleAccordion('material-section')">Material &#9662;</button>
    <div class="accordion-content" id="material-section">
    Most of the material used in this series of seminars is derived from Prof. David Garcia "Computational Modelling of Social Systems" course. You can find useful material on his <a href="https://github.com/dgarcia-eu/CMSS-Konstanz?tab=readme-ov-file">website</a>.
     	<h3> Seminars </h3>
    	<h5> </h5>
        <div class="nested-accordion">
           <button class="nested-accordion-button">Seminar 1 &#9662;</button>
           <div class="nested-accordion-content">
               <h4>Readings and Slides</h4>
                   <ul>
                       <li><a href="/files/CMSS_Seminar1.pdf">Slides</a></li>
                       <li><a href="https://journals.sagepub.com/doi/abs/10.1177/1088868306294789">Agent-Based Modeling: A New Approach for Theory Building in Social Psychology. Eliot Smith and Frederica Conrey. Personality and Social Psychology Review, 2007.</a></li>
                       <li><a href="https://psycnet.apa.org/record/1987-04005-001">The matching hypothesis reexamined. Michael Kalick and Thomas Hamilton. Journal of Personality and Social Psychology, 1986.</a></li>
                   </ul>
               <h4>Additional Readings</h4>
                   <ul>
                       <li><a href="https://www.annualreviews.org/doi/abs/10.1146/annurev.soc.012809.102632">Causal Mechanisms in the Social Sciences. Peter Hedström and Petri Ylikoski. Annual Review of Sociology, 2010.</a></li>
                       <li><a href="https://www.annualreviews.org/doi/abs/10.1146/annurev.soc.28.110601.141117">From factors to actors: Computational Sociology and Agent-Based Modeling. Michael Macy and Robert Willer. Annual Review of Sociology, 2002.</a></li>
                   </ul>
           </div>
       </div>
       <div class="nested-accordion">
           <button class="nested-accordion-button">Seminar 2 &#9662;</button>
           <div class="nested-accordion-content">
               <h4>Readings and Slides</h4>
                   <ul>
                       <li><a href="/files/CMSS_Seminar2.pdf">Slides</a></li>
                       <li><a href="https://www.uzh.ch/cmsssl/suz/dam/jcr:00000000-68cb-72db-ffff-ffffff8071db/04.02%7B_%7Dschelling%7B_%7D71.pdf">Dynamic Models of Segregation. Thomas Schelling. Journal of Mathematical Sociology, 1971 (pages 143 to 166).</a></li>
                       <li><a href="https://web.stanford.edu/class/sts145/Library/life.pdf">The fantastic combinations of John Conway’s new solitaire game “life”. Martin Gardner. Scientific American, 1970.</a></li>
                   </ul>
               <h4>Additional Readings</h4>
                   <ul>
                       <li><a href="https://www.jasss.org/15/1/6.html">The Schelling Model of Ethnic Residential Dynamics: Beyond the Integrated - Segregated Dichotomy of Patterns. Erez Hatnaa and Itzhak Benenson. Journal of Artificial Societies and Social Simulation, 2012.</a></li>
                   </ul>
           </div>
       </div>
       <div class="nested-accordion">
           <button class="nested-accordion-button">Seminar 3 &#9662;</button>
           <div class="nested-accordion-content">
               <h4>Readings and Slides</h4>
                   <ul>
                       <li><a href="/files/CMSS_Seminar3.pdf">Slides</a></li>
                       <li><a href="https://journals.sagepub.com/doi/pdf/10.1177/0022002797041002001">The Dissemination of Culture: A Model with Local Convergence and Global Polarization. Robert Axelrod, Journal of Conflict Resolution 41(20), 1997.</a></li>
                   </ul>
               <h4>Additional Readings</h4>
                   <ul>
                       <li><a href="https://www.worldscientific.com/doi/abs/10.1142/S0219525913500379">Measuring cultural dynamics through the Eurovision song contest. David Garcia and Dorian Tanase. Advances in Complex Systems, 16 (2013).</a></li>
                       <li><a href="https://arxiv.org/pdf/1701.07419.pdf">A gentle introduction to the minimal Naming Game. Andrea Baronchelli (2017).</a></li>                       
                   </ul>
           </div>
       </div>
       <div class="nested-accordion">
           <button class="nested-accordion-button">Seminar 4 &#9662;</button>
           <div class="nested-accordion-content">
               <h4>Readings and Slides</h4>
                   <ul>
                       <li><a href="/files/CMSS_Seminar4.pdf">Slides</a></li>
                       <li><a href="https://www.jstor.org/stable/2778111">Threshold Models of Collective Behavior. Mark Granovetter. American Journal of Sociology (1978).</a></li>
                   </ul>
               <h4>Additional Readings</h4>
                   <ul>
                       <li><a href="https://www.science.org/doi/10.1126/science.aas8827">Experimental evidence for tipping points in social convention. Science, 360 (2018).</a></li>                       
                   </ul>
           </div>
       </div>
       <h3> Coding Sessions </h3>
      	<div class="nested-accordion">
           <button class="nested-accordion-button">Coding Session 1 &#9662;</button>
           <div class="nested-accordion-content">
               <a href="/files/mesa_introduction.zip">Introduction Material</a>
           </div>
       </div>  
       <div class="nested-accordion">
       	   <button class="nested-accordion-button">Coding Session 2 &#9662;</button>
           <div class="nested-accordion-content">
               <a href="/files/ex_01_schelling.zip">Schelling's Model</a>
           </div>
       </div>  
       <div class="nested-accordion">
           <button class="nested-accordion-button">Coding Session 3 &#9662;</button>
           <div class="nested-accordion-content">
               <a href="/files/ex_02_granovetter.zip">Granovetter's Model</a>
           </div>
       </div>  
    </div>

    <!-- Material Section -->
    <button class="accordion-button" onclick="toggleAccordion('material-section')">Material &#9662;</button>
    <div class="accordion-content" id="material-section">
     	<h3> Lessons </h3>
    	<h5> </h5>
        <div class="nested-accordion">
           <button class="nested-accordion-button">Lesson 4 &#9662;</button>
           <div class="nested-accordion-content">
               <h4>Readings and Slides</h4>
                   <ul>
                       <li><a href="/files/DLSS4.pdf">Slides</a></li>
                   </ul>
           </div>
       </div>

</div>

