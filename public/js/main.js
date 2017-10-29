// let's use jquery
$(document).ready(function(){
  $('.delete-reservation').on('click', function(event){
    $target = $(event.target);
    //console.log($target.attr('data-id'));
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/reservations/'+id,
      success: function(response){
        alert('Deleting Reservation');
        window.location.href = '/'; // redirect to the homepage
      },
      error: function(err){
        console.log(err);
      }
    });

  });
});
