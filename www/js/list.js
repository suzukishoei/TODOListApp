/**
 * タスクリスト表示
 * @param {JSON} data 表示するタスクのリスト
 */
var dispTasksList = function (data) {
  // list.htmlの<ons-list id="listView">を取得
  var elem_list = document.getElementById('listView');
  // 子要素を全て削除
  elem_list.textContent = null;

  /**
   * タスクの数に応じて一覧を作成
   */
  for (var i = 0; i < data.items.length; i++) {
    // タスクの状態がneedsAction(=未完了)の場合
    if (data.items[i].status === "needsAction") {
      // タスクのタイトルを取得
      var taskTitle = data.items[i].title;
      // タスクの期限を取得
      //var taskLimit = data.items[i].;
      // タスクのタイトルがあるとき
      if (taskTitle) {
        // 空の<ons-list-item>を作成
        var elem_list_item = document.createElement('ons-list-item');
              
        // <ons-list-item>のHTML要素にタイトル名を追加
        elem_list_item.innerHTML =  
        //チェックボックスを追加
        `<label class="left">
        <ons-checkbox input-id="check-1"></ons-checkbox>
      </label>
      <label for="check-1" class="center">`
          + taskTitle; +
        `</label>`;        
        // <ons-list-item>タスクをリストに追加
        elem_list.appendChild(elem_list_item);
      }
    }
  }
}

/**
 * タスク追加
 */
var insertTask = function () {// 入力値の取得
  item = document.getElementById('input_task_title').value;

  if (!accessToken) {
    return;
  }

  //何も入力されていない場合
  if(item === ""){
    ons.notification.toast('タスクが入力されていません', { timeout: 3000, animation: 'fall' })
    hideInsertDialog(); //ダイアログを閉じる
    return;
  }

  var inputTask = {
    'title': item
  }

  $.ajax({
    type: 'post',
    url: 'https://www.googleapis.com/tasks/v1/lists/@default/tasks?access_token=' + accessToken,
    data: JSON.stringify(inputTask), // 追加するタスク情報
    contentType: 'application/JSON',
    dataType: 'JSON',
    scriptCharset: 'utf-8',

    success: function (data, status) {
      console.log(status, data);
      hideInsertDialog();
      getTasks(); // リストを更新
    },

    error: function (data, status) {
      // Error
      console.log(status, data);
    }
  });
};

/**
 * タスク追加ダイアログを表示
 */
var createInsertDialog = function () {

  var dialog = document.getElementById('insert-task');

  if(dialog){
    dialog.show();
  }else{
    ons.createElement('insert_task_dialog.html', {append: true})
      .then(function(dialog){
        dialog.show();
      });
  }
};

// タスク追加ダイアログを非表示
var hideInsertDialog = function () {
  document.getElementById('insert-task').hide();
  document.getElementById('input_task_title').value = '';
};
