$(function() {
  getTasks();

  $('.taskForm').on('submit', addTask);

  $('#taskList').on('click', '.complete', completeTask);

  $('#taskList').on('click', '.delete', deleteTask);
});

function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: appendTasks
  });
};

function appendTasks(response) {
  var $tasks = $('#taskList');
  $tasks.empty();
  response.forEach(function(task) {
    var $div = $('<div></div>');
    var complete = task.complete;
    $div.append('<p class="taskDesc ' + task.complete + '">' + task.task + '</p>');
    $div.data('complete', task.complete);

    // make a completed button and store the id data on it
    var $completeButton = $('<button class="action complete">&#x2713;</button>');
    $completeButton.data('id', task.id);
    $div.append($completeButton);

    // make a delete button
    var $deleteButton = $('<button class="action delete">X</button>');
    $deleteButton.data('id', task.id);
    $div.append($deleteButton);

    $tasks.append($div);
  });
}

function addTask(event) {
  event.preventDefault();
  var taskData = $(this).serialize();
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
  var checkstr =  confirm('Are you sure you want to delete this task?');
  if(checkstr == true) {
    var $taskId = $(this).data('id');
    $.ajax({
        type: 'DELETE',
        url: '/todo/' + $taskId,
        success: getTasks
      });
  } else {
    return false;
  }
}
