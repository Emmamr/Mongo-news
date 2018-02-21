$(document).ready(function(){
    $('.button-collapse').sideNav();
  
    $('.modal').modal();
  
    $('.save-article-button').on('click', function() {
     var dbId = $(this).data('dbid');
     $.ajax({
        method: "PUT",
        url: "/articles/" + dbId,
        data: { saved: true }
      }).done(function(data) {
        console.log(data);
      });
      $(this).html("Article saved");
    });
    
   $('.delete-from-saved-button').on('click', function() {
      var dbId = $(this).data('dbid');
     $.ajax({
        method: "PUT",
        url: "/articles/" + dbId,
        data: { saved: false }
      }).done(function(data) {
        location.reload();
      })
    });
  
    $('.view-comments-button').on('click', function() {
      var dbId = $(this).data('dbid');
      $("#comment-input").val('');
      $.ajax({
        method: "GET",
        url: "/articles/" + dbId
      }).done(function(data){
        console.log(data);
        $('.modal-title').html(data.title);
        $('.comment-display-root').empty();
        $('.save-comment-button').data('dbid', data._id);
        if (data.comments.length === 0) {
          $('.comment-display-root').html("No comments yet. Be the first to comment!");
        } else {
          for (var i = 0; i < data.comments.length; i++) {
            var newCard = 
              "<div class='card blue-grey darken-1'><div class='card-content white-text valign-wrapper'><p class='col s11 left-align'>" 
              + data.comments[i].body + "</p><button class='col s1 btn delete-comment-button' data-dbid='" + data.comments[i]._id + "'>X</button></div></div>";
            $('.comment-display-root').prepend(newCard);
          }
        }
      });
    });
  
    $('.save-comment-button').on('click', function() {
      var dbId = $(this).data('dbid');
      $.ajax({
        method: "POST",
        url: "/articles/" + dbId,
        data: {
          body: $("#comment-input").val()
        }
      }).done(function(data) {
        console.log(data);
        $(this).html("Comment Saved")
      })
    });
  
    $(document).on('click', '.delete-comment-button', function() {
      var dbId = $(this).data('dbid');
      $.ajax({
        method: "DELETE",
        url: "comments/" + dbId
      }).done(function(data) {
        console.log(data);
        location.reload();
      })
    });
  });