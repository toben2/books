from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

from pymongo import MongoClient  # pymongo를 임포트 하기(패키지 인스톨 먼저 해야겠죠?)

client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
db = client.dbsparta  # 'dbsparta'라는 이름의 db를 만듭니다.

## HTML을 주는 부분
@app.route('/')
def home():
    return render_template('index.html')

## HTML을 주는 부분
@app.route('/write')
def write():
    return render_template('write.html')


## API 역할을 하는 부분
@app.route('/reviews', methods=['POST'])
def write_review():
    # required
    title_receive = request.form['title_give']
    author_receive = request.form['author_give']
    review_receive = request.form['review_give']

    # optional
    category_receive = request.form['category_give'] if 'category_give' in request.form else None
    image_receive = request.form['image_give'] if 'image_give' in request.form else None
    datePicker_receive = request.form['datePicker_give'] if 'datePicker_give' in request.form else None
    hashtag_receive = request.form['hashtag_give'] if 'hashtag_give' in request.form else None



    review = {
       'title': title_receive,
       'author': author_receive,
       'category': category_receive,
       'image' : image_receive,
       'datePicker' : datePicker_receive,
       'review': review_receive,
       'hashtag' : hashtag_receive.split(",")

    }

    db.reviews.insert_one(review)
    return jsonify({'result': 'success', 'msg': '리뷰가 성공적으로 작성되었습니다.'})


@app.route('/reviews', methods=['GET'])
def read_reviews():
    reviews = list(db.reviews.find({},{'_id':0}))
    print(reviews)
    return jsonify({'result': 'success', 'reviews': reviews})


if __name__ == '__main__':
    app.run('localhost', port=5000, debug=True)