import pandas as pd
import nltk
from nltk.corpus import stopwords

username = "@JoeBiden"
twitter_df = pd.read_csv(f"data/{username}_freq.csv")

df = twitter_df[:100]

stop_words = stopwords.words("english")

top_N = 20
a = df["tweet"].str.cat(sep=' ')
words = nltk.tokenize.word_tokenize(a)
words = [word for word in words if not word in stop_words]
word_dist = nltk.FreqDist(words)
rslt = pd.DataFrame(word_dist.most_common(top_N),
                    columns=['text', 'weight'])

return rslt.to_json