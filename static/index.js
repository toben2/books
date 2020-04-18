 $(document).ready(function() {
    $(function() {	
		$('#datePicker').datepicker({
            setDate: new Date(),
		    format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
		    autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
		    clearBtn : false, //날짜 선택한 값 초기화 해주는 버튼 보여주는 옵션 기본값 false 보여주려면 true
		    disableTouchKeyboard : false,	//모바일에서 플러그인 작동 여부 기본값 false 가 작동 true가 작동 안함.
		    immediateUpdates: false,	//사용자가 보는 화면으로 바로바로 날짜를 변경할지 여부 기본값 :false 
		    multidate : false, //여러 날짜 선택할 수 있게 하는 옵션 기본값 :false 
		    multidateSeparator :",", //여러 날짜를 선택했을 때 사이에 나타나는 글짜 2019-05-01,2019-06-01
		    templates : {
		        leftArrow: '&laquo;',
		        rightArrow: '&raquo;'
		    }, //다음달 이전달로 넘어가는 화살표 모양 커스텀 마이징 
		    showWeekDays : true ,// 위에 요일 보여주는 옵션 기본값 : true
		    todayHighlight : true ,	//오늘 날짜에 하이라이팅 기능 기본값 :false 
		    toggleActive : true,	//이미 선택된 날짜 선택하면 기본값 : false인경우 그대로 유지 true인 경우 날짜 삭제
		    weekStart : 0 ,//달력 시작 요일 선택하는 것 기본값은 0인 일요일 
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
		    
        });//datepicker end
        
        
    });//ready end

    $('#post-cards').html('');
            listing();
        });

        

        function make_review() {
            // 1. 제목, 저자, 리뷰 내용을 가져옵니다.
            let title = $('#title').val();
            let author = $('#author').val();
            let category = $('#category').val();
            let image = $('#image').val();
            let datePicker = $('#datePicker').val();
            let review = $('#review').val();
            let hashtag = $('#hashtag').val();
     

            // 2. 제목, 저자, 리뷰 중 하나라도 입력하지 않았을 경우 alert를 띄웁니다.
            // 지난 주에 배웠던 Input Validation 파트 입니다.
            // Input validation 종류 : 입력 여부, 포맷 확인, 최대 길이 제한 등
            if (title == '') {
                alert('제목을 입력해주세요');
                $('#title').focus();
                return;
            } else if (author == '') {
                alert('저자를 입력해주세요');
                $('#author').focus();
                return;
            } else if (review == '') {
                alert('리뷰를 입력해주세요');
                $('#review').focus();
                return;
            }
            // 위에 return (함수 종료시키기)을 빼고 아래 코드 전체를 else 안에 넣어도 무방!
            // (하지만 가독성 측면에서는 현재 코드 방식이 나음)
            // is_long 부분도 구현

            // 3. POST /write 에 저장을 요청합니다.
            // GET과 달리 data 부분에 딕셔너리 형태로 값을 넣어줌!
            $.ajax({
                type: "POST",
                url: "/reviews",
                data: {
                    title_give: title,
                    author_give: author,
                    category_give: category,
                    image_give: image,
                    datePicker_give: datePicker,
                    review_give: review,
                    hashtag_give: hashtag

                    },
                success: function(response) {
                    if (response['result'] == 'success') {
                        alert(response['msg']);
                        $('#title').val('');
                        $('#author').val('');
                        $('#category').val('');
                        $('#image').val('');
                        $('#datePicker').val('');
                        $('#review').val('');
                        $('#hashtag').val('');
                        window.location.reload();
                    }
                }
            })
        }

        function listing() {
            // 1. 리뷰 목록을 서버에 요청하기
            $.ajax({
                type: "GET",
                url: "/reviews",
                data: {},
                success: function(response) {
                    // 2. 요청 성공 여부 확인하기
                    if (response['result'] == 'success') {
                        let reviews = response['reviews'];
                        // 3. 요청 성공했을 때 리뷰를 올바르게 화면에 나타내기
                        for (let i = 0; i < reviews.length; i++) {
                            make_card(reviews[i]['title'], reviews[i]['author'], reviews[i]['category'], reviews[i]['image'], reviews[i]['datePicker'], reviews[i]['review'], reviews[i]['hashtag']);
                        }
                    } else {
                        alert('리뷰를 받아오지 못했습니다');
                    }
                }
            })
        }

        // function make_card(title, author, category, image, datePicker, review, hashtag) {
        //     let temp_html = '<tr>\
        //                         <td>' + title + '</td>\
        //                         <td>' + author + '</td>\
        //                         <td>' + category + '</td>\
        //                         <td>' + image + '</td>\
        //                         <td>' + datePicker + '</td>\
        //                         <td>' + review + '</td>\
        //                         <td>' + hashtag + '</td>\
        //                     </tr>';
        //     $('#post-cards').append(temp_html);
        // }

        function make_card(title, author, category, image, datePicker, review, hashtag) {
            let image_dummy = '/static/book_dummy.jpg'
            let temp_html = '<div class="card">\
              <img class="card-img-top" src="'+ image_dummy + '" alt="Card image cap">\
              <div class="card-body">\
              <p class="card-title">'+ title + '</p>\
                <p class="card-subtitle mb-2 text-muted">'+ author + '</p>\
                <p class="card-text">'+ category + '</p>\
                <p class="card-text">'+ datePicker + '</p>\
                <p class="card-text">'+ hashtag + '</p>\
                <p class="card-text comment">'+ review + '</p>\
              </div>\
            </div>';
            $('#post-cards').append(temp_html);
          }




        function is_long(obj) {
            let content = $(obj).val();
            if (content.length > 140) {
                alert('리뷰는 140자까지 기록할 수 있습니다.');
                $(obj).val(content.substring(0, content.length - 1));
            }
        }

        
        function button1_click() {
            window.open('http://localhost:5000/write');
	    }
