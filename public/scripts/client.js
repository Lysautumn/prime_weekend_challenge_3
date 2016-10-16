$(function() {
  getTasks();

  $('.taskForm').on('submit', addTask);

  $('#taskList').on('click', '#complete', completeTask);
});

function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: appendTasks
  });
};

function appendTasks(response) {
  console.log(response);
  var $tasks = $('#taskList');
  $tasks.empty();
  response.forEach(function(task) {
    var $div = $('<div></div>');
    $div.append('<p>' + task.task + '</p>');

    // make a completed button and store the id data on it
    var $completeButton = $('<button id="complete">Done</button>');
    $completeButton.data('id', task.id);
    $div.append($completeButton);

    // make a delete button
    var $deleteButton = $('<button class="delete">X</button>');
    $deleteButton.data('id', task.id);
    $div.append($deleteButton);

    $tasks.append($div);
  });
}

function addTask(event) {
  event.preventDefault();
  var taskData = $(this).serialize();
  console.log('taskData:', taskData);
  $.ajax({
    type: 'POST',
    url: '/todo',
    data: taskData,
    success: getTasks
  });
  $(this).find('input').val('');
}

function completeTask(event) {
  event.preventDefault();

  $.ajax({
    type: 'PUT',
    url: '/task/',
    data: completeTask,
    success: getTasks
  });
};
