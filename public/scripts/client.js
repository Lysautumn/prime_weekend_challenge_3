$(function() {
  getTasks();

  $('.taskForm').on('submit', addTask);

  $('#taskList').on('click', '.complete', completeTask);

  $('#taskList').on('click', '.delete', deleteTask);
});

function getTasks() {
  console.log('getTasks');
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: appendTasks
  });
};

function appendTasks(response) {
  console.log('append tasks');
  var $tasks = $('#taskList');
  $tasks.empty();
  response.forEach(function(task) {
    var $div = $('<div></div>');
    $div.append('<p>' + task.task + '</p>');
    $div.data('complete', task.complete);

    // make a completed button and store the id data on it
    var $completeButton = $('<button class="complete">Done</button>');
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
  var id = $(this).data('id');
  var status = $(this).data('complete');
  var completeTask = {'id': id, 'complete': status};
  $.ajax({
    type: 'PUT',
    url: '/todo/' + id,
    data: completeTask,
    success: getTasks
  });
};

function deleteTask(event) {
  event.preventDefault();
  var $taskId = $(this).data('id');
  $.ajax({
    type: 'DELETE',
    url: '/todo/' + $taskId,
    success: getTasks
  });
}
