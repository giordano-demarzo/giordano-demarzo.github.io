#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Nov 26 22:20:44 2024

@author: giordano
"""
import os
import glob
import pandas as pd
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import dash
from dash import dcc, html, Input, Output, State
from dash_d3_cloud import WordCloud as D3WordCloud
import dash_bootstrap_components as dbc
import plotly.graph_objs as go
from wordcloud import WordCloud
import base64
from io import BytesIO

# Ensure NLTK data is downloaded
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

# Data Preparation
data_folder = 'data'  # Path to your data folder
file_pattern = os.path.join(data_folder, 'text_news_*.txt')
file_list = glob.glob(file_pattern)

data_list = []

for file_path in file_list:
    # Extract year from filename
    match = re.search(r'text_news_(\d{4})\.txt', os.path.basename(file_path))
    if match:
        year = int(match.group(1))
    else:
        continue  # Skip files that don't match the pattern
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            document = line.strip()
            if document:  # Skip empty lines
                data_list.append({'year': year, 'document': document})

# Create DataFrame
df = pd.DataFrame(data_list)
df = df.sample(10000)

#%%
# Preprocess Documents
stop_words = set(stopwords.words('english'))

def preprocess_document(doc):
    doc = doc.lower()
    tokens = word_tokenize(doc)
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
    return tokens

df['tokens'] = df['document'].apply(preprocess_document)

#%%
# Calculate Word Frequencies per Year
df_exploded = df.explode('tokens')
df_exploded = df_exploded[['year', 'tokens']].rename(columns={'tokens': 'word'})
word_counts = df_exploded.groupby(['year', 'word']).size().reset_index(name='count')


#%%
import dash
from dash import dcc, html, Input, Output, State
import dash_bootstrap_components as dbc
import plotly.graph_objs as go
import nltk
from wordcloud import WordCloud
import base64
from io import BytesIO

# Assume data has been preprocessed and the variables `df` and `word_counts` are available
# df: DataFrame with columns 'year', 'tokens' (list of tokens for each document)
# word_counts: DataFrame with columns 'year', 'word', 'count'

external_stylesheets = [dbc.themes.FLATLY]
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)
server = app.server  # For deployment if needed

# Updated Layout
app.layout = dbc.Container([
    dbc.Row([
        dbc.Col(html.H1('Word Frequency Analyzer', className='text-center text-primary mb-4'), width=12)
    ]),
    dbc.Row([
        dbc.Col([
            dbc.Input(
                id='search-words',
                type='text',
                placeholder='Enter words to search (separated by commas)',
                className='mb-2'
            ),
            dbc.Button(
                'Search',
                id='search-button',
                n_clicks=0,
                color='primary',
                className='mb-2 w-100',
            ),
            dbc.RadioItems(
                id='wordcloud-method',
                options=[
                    {'label': 'Standard Word Cloud', 'value': 'standard'},
                    {'label': 'Adjusted Word Cloud', 'value': 'adjusted'}
                ],
                value='standard',
                className='mb-2',
            ),
            html.Div(id='error-message', className='text-danger'),
            html.H5(id='wordcloud-title', className='text-center mt-4'),
            html.Div(id='wordcloud', className='d-flex justify-content-center'),
        ], width=4),
        dbc.Col([
            dcc.Graph(id='frequency-plot', clickData=None),
        ], width=8)
    ]),
    dcc.Store(id='stored-clickdata'),  # Store for clickData
], fluid=True)

# Callback to update the frequency plot
@app.callback(
    Output('frequency-plot', 'figure'),
    Output('error-message', 'children'),
    Input('search-button', 'n_clicks'),
    State('search-words', 'value')
)
def update_frequency_plot(n_clicks, search_words):
    if n_clicks == 0 or not search_words:
        return {}, ''
    search_words = [word.strip().lower() for word in search_words.split(',') if word.strip()]
    if not search_words:
        return {}, 'Please enter at least one word to search.'
    fig = go.Figure()
    colors = ['#007bff', '#ff5733', '#28a745', '#6f42c1', '#fd7e14', '#17a2b8', '#e83e8c', '#343a40']
    error_message = ''
    for i, search_word in enumerate(search_words):
        df_word = word_counts[word_counts['word'] == search_word]
        if df_word.empty:
            error_message += f'No occurrences of "{search_word}" found.<br>'
            continue
        df_word = df_word.sort_values('year')
        color = colors[i % len(colors)]  # Cycle through colors
        fig.add_trace(go.Scatter(
            x=df_word['year'],
            y=df_word['count'],
            mode='lines+markers',
            name=search_word,
            line=dict(color=color)
        ))
    if not fig.data:
        return {}, error_message
    fig.update_layout(
        title='Frequency of Words Over Time',
        xaxis_title='Year',
        yaxis_title='Count',
        template='simple_white'
    )
    return fig, error_message

# Callback to store clickData
@app.callback(
    Output('stored-clickdata', 'data'),
    Input('frequency-plot', 'clickData')
)
def store_clickdata(clickData):
    return clickData

# Callback to update the word cloud
@app.callback(
    Output('wordcloud', 'children'),
    Output('wordcloud-title', 'children'),
    [Input('stored-clickdata', 'data'),
     Input('wordcloud-method', 'value')],
    State('search-words', 'value')
)
def update_wordcloud(stored_clickdata, wordcloud_method, search_words):
    if not stored_clickdata or not search_words:
        return '', ''
    # Get the word and year from stored_clickdata
    point = stored_clickdata['points'][0]
    year = point['x']
    curve_number = point['curveNumber']  # Index of the trace that was clicked
    search_words = [word.strip().lower() for word in search_words.split(',') if word.strip()]
    if curve_number < len(search_words):
        search_word = search_words[curve_number]
    else:
        return '', ''
    # Filter the DataFrame for the selected year
    df_year = df[df['year'] == int(year)]
    if df_year.empty:
        return html.P(f'No documents found for the year {year}.', className='text-danger'), ''
    
    # Subset of documents containing the search word
    df_subset = df_year[df_year['tokens'].apply(lambda tokens: search_word in tokens)]
    if df_subset.empty:
        return html.P(f'No documents containing "{search_word}" found for the year {year}.', className='text-danger'), ''
    
    # Calculate word frequencies in the subset
    all_words_subset = [word for tokens in df_subset['tokens'] for word in tokens]
    freq_subset = nltk.FreqDist(all_words_subset)
    
    if wordcloud_method == 'adjusted':
        # Calculate relative frequencies in the subset
        total_words_subset = len(all_words_subset)
        rel_freq_subset = {word: freq / total_words_subset for word, freq in freq_subset.items()}
        
        # Calculate word frequencies in all documents of the year
        all_words_year = [word for tokens in df_year['tokens'] for word in tokens]
        freq_year = nltk.FreqDist(all_words_year)
        total_words_year = len(all_words_year)
        rel_freq_year = {word: freq / total_words_year for word, freq in freq_year.items()}
        
        # Compute the deviation of frequencies
        word_deviation = {}
        for word in rel_freq_subset:
            freq_subset_word = rel_freq_subset[word]
            freq_year_word = rel_freq_year.get(word, 0)
            if freq_year_word > 0:
                deviation = freq_subset_word / freq_year_word
                word_deviation[word] = deviation
            else:
                # Assign a high deviation if the word is absent in the background
                word_deviation[word] = float('inf')
        
        # Filter words based on deviation threshold and minimum frequency
        deviation_threshold = 1.5  # Adjust this threshold as needed
        min_freq_threshold = 5   # Minimum frequency in the subset
        filtered_words = [
            word for word in word_deviation
            if word_deviation[word] >= deviation_threshold and freq_subset[word] >= min_freq_threshold
        ]
        
        # Use subset frequencies for word cloud weights
        word_scores = {word: freq_subset[word] for word in filtered_words}
        
        # If no words meet the criteria, fall back to standard word cloud
        if not word_scores:
            word_scores = dict(freq_subset.most_common(100))
            wordcloud_title = f'Standard Word Cloud for "{search_word}" in {year} (No significant deviations found)'
        else:
            wordcloud_title = f'Adjusted Word Cloud for "{search_word}" in {year}'
        
    else:
        # Standard word cloud using frequencies in the subset
        word_scores = dict(freq_subset.most_common(100))
        wordcloud_title = f'Standard Word Cloud for "{search_word}" in {year}"'
    
    # Generate the word cloud using word_scores
    wc = WordCloud(
        width=250,
        height=150,
        background_color='white',
        colormap='plasma'
    ).generate_from_frequencies(word_scores)
    
    # Convert the word cloud to an image
    img = BytesIO()
    wc.to_image().save(img, format='PNG')
    img.seek(0)
    encoded_image = base64.b64encode(img.read()).decode('ascii')
    
    return html.Img(
        src='data:image/png;base64,{}'.format(encoded_image),
        style={'width': '100%', 'height': 'auto', 'margin-bottom': '20px'}
    ), wordcloud_title

if __name__ == '__main__':
    app.run_server(debug=True)
