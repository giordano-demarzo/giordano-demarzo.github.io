# Project Title: Synthetic Product Review Generation for Market Analysis

## Project Description

This project aims to use deep learning to generate synthetic product reviews based on real reviews from an e-commerce platform (e.g., Amazon). Students will fine-tune a pre-trained GPT-2 model to create realistic synthetic reviews. The generated data will then be analyzed to draw insights into real-world customer preferences, common issues, and overall sentiment towards specific products or product categories.

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

    Data Collection
        Collect a dataset of product reviews from an e-commerce platform. We advise to use a readily available data set such as [Amazon Product Reviews](https://www.kaggle.com/datasets/arhamrumi/amazon-product-reviews).
        
    Data Cleaning
        Investigate if you have to do preprocessing streps such as removing duplicates, non-English posts, and irrelevant content.
        Implement necessary preprocessing steps (e.g., tokenization, cleaning).
        
    Preliminary Data Analysis and Visualization
        Perform preliminary data analysis and visualization to understand the characteristics of the dataset (e.g., review length, sentiment distribution, common keywords, etc).
        Visualize the data using charts (e.g., bar charts for rating distribution, word clouds for common keywords).

### Part 2: Deep Learning Model (10 points)

    Fine-tune GPT-2
        Fine-tune a GPT-2 model on the collected dataset to generate synthetic product reviews. Provide fully commented code (for example in pytorch) that goes line-by-line through the finetuning process (to see an example of the fine-tuning process check out for example [https://colab.research.google.com/drive/13dZVYEOMhXhkXWfvSMVM1TTtUDrT6Aeh](https://colab.research.google.com/drive/13dZVYEOMhXhkXWfvSMVM1TTtUDrT6Aeh)). Don't just use one-liners with a high level API (like Hugging Face trainer). Provide the link to a code repository in your report where you share the fully commented and reproducible code.
        
    Exploration of Synthetic Data Quality
        Use systematic prompt engineering to ensure the synthetic reviews are coherent and relevant to the products being reviewed.
        Evaluate the quality of the generated reviews using both quantitative metrics (e.g., perplexity) and qualitative methods (e.g., human evaluation).
        
    Comparison with State-of-the-Art Models
        Use a state of the art model such as Llama3 8B (you can use the Inference API on Hugging Face for that with the model [https://huggingface.co/meta-llama/Meta-Llama-3-8B](https://huggingface.co/meta-llama/Meta-Llama-3-8B) or other tools [Ollama](https://ollama.com/library/llama3:8b)) with suitable prompts to create an additional corpus of synthetic reviews.

### Part 3: Social Science Research Analysis (10 points)

    Research Analysis Using the Generated Data
        Use the synthetic reviews to conduct market analysis.
        Analyze customer preferences, identify common issues, and assess overall sentiment towards products.
        Compare synthetic reviews from the two different models with real reviews to evaluate the model's ability to capture customer feedback accurately.
        
    Presentation and Report
        Discuss the similarities and differences, and reflect on the implications for market analysis.
        Discuss the wider societal implication of such synthetic data approaches.
        Present the key research findings in a well-organized report in a clear and concise manner.

## Grading Criteria

    Presentation of Data and Preliminary Data Analysis (10 points)
        Correct handling of the dataset.
        Quality and clarity of the data visualizations.
        Sound preliminary analysis.
        Convincing motivation for the steps to follow.

    Deep Learning Model (10 points)
        Correct implementation of fine-tuning the GPT-2 model.
        Best practices used to ensure quality and relevance of the generated synthetic reviews (prompt engineering).

    Subsequent Research Analysis (10 points)
        Depth and rigor of the analysis.
        Systematic comparison between synthetic and real reviews.
        Integration of theoretical discussions with empirical findings.
        Overall presentation of the research findings.


