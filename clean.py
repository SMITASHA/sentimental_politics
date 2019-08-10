# Import Dependencies
import re
import spacy
from spacy.attrs import ORTH, LEMMA, NORM, TAG


def replace_emoticons(string):
    """Replace emoticons with positive or negative words"""

    
    # Define emoticons to be replaced
    emoticons ={'Good': [':-)', ':)', ';)', ':o)', ':]', ':3', ':c)', ':>', '=]', '8)', '=)',                          ':}', ':^)', ':-D', ':D', '8-D', '8D', 'x-D', 'xD', 'X-D', 'XD', '=-D',                          '=D', '=-3', '=3', ':-))', ":'-)", ":')", ':*', ':^*', '>:P', ':-P',                          ':P', 'X-P','x-p', 'xp', 'XP', ':-p', ':p', '=p', ':-b', ':b', '>:)',                          '>;)', '>:-)', '<3'],                'Bad': [':L', ':-/', '>:/', ':S', '>:[', ':@', ':-(', ':[', ':-||', '=L', ':<',                        ':-[', ':-<', '=\\', '=/', '>:(', ':(', '>.<', ":'-(", ":'(", ':\\', ':-c',                        ':c', ':{', '>:\\', ';(']}
    
    # If a string in a tweet is an emoticon, replace that emoticon with positive/negative word
    for emoticon_key, emoticon_val in emoticons.items():
        if string in emoticon_val:
            string = emoticon_key
            break
        
    return(string)


def clean_text(string):
    """Cleans given string from tweet to prepare for using in machine learning model"""
    
    
    # Make lowercase
    string = string.lower()
    # Replace emoticons
    string = replace_emoticons(string)
    # Replace emojis
    string = re.sub(r'[^\x00-\x7F]+','', string)
    # Remove hyperlinks
    string = re.sub(r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\), ]|(?:%[0-9a-fA-F][0-9a-fA-F]))\S+","", string)
    # Remove HTML special entities
    string = re.sub(r"\&\w*;"," ", string)
    # Convert remove twitter usernames
    string = re.sub(r"@[^\s]+","", string)
    # Remove numbers
    string = re.sub("\d+", "", string)
    # Remove sepcial characters
    string = re.sub(r"[!#$%&'\\()*+,-./:;<=>?@\^_`{|}~]", " ", string)
    string = re.sub(r"\[", " ", string)
    string = re.sub(r"\]", " ", string)
    
    return(string)


def clean_tweet(tweet, nlp):
    """Lemmatizes tweet and replaces stop words"""
    
    
    # Define contractions to be replaced
    TOKENIZER_EXCEPTIONS = {
        "don't": [
            {ORTH: "do", LEMMA: "do"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "doesn't": [
            {ORTH: "does", LEMMA: "do"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "didn't": [
            {ORTH: "did", LEMMA: "do"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "can't": [
            {ORTH: "ca", LEMMA: "can"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "couldn't": [
            {ORTH: "could", LEMMA: "can"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "haven't": [
            {ORTH: "have", LEMMA: "have"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "hasn't": [
            {ORTH: "has", LEMMA: "have"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "hadn't": [
            {ORTH: "had", LEMMA: "have"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "won't": [
            {ORTH: "wo", LEMMA: "will"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}],
        "wouldn't": [
            {ORTH: "would", LEMMA: "will"},
            {ORTH: "n't", LEMMA: "not", NORM: "not", TAG: "RB"}]
    }
    
    # Add contractions and replacements to tokenizer list
    for tok, rule in TOKENIZER_EXCEPTIONS.items():
        nlp.tokenizer.add_special_case('u'+tok, rule)

    # Remove words from default stop word list that may have impact on sentiment
    nlp.Defaults.stop_words -= {'but', 'again', 'front','keep', 'nothing', 'can', "n't"                                'down','against', 'above', 'nor', 'serious', 'should',                                'not', 'never', 'across', 'bottom', 'least', 'alone',                                 'below','first', 'top', 'up', 'neither', 'without',                                 'empty', 'over', 'no', 'well'}
    
    # Add spacy -PRON- designation to stop words
    nlp.Defaults.stop_words |= {"-PRON-",}
    
    # Lemmatize tweet
    doc = nlp(tweet)
    
    # Create empty list for cleaned text
    text = []
    
    # Clean words in tweet
    for token in doc:
        string = token.lemma_
        
        # Verify not a stop word and clean
        if string not in nlp.Defaults.stop_words:
            string = clean_text(string)
            
            # Add only non-empty strings to text list
            if string.strip():
                text.append(string)

    # Return cleaned tweet as single string
    tweet_cleaned = ' '.join(text)
    
    return(tweet_cleaned)