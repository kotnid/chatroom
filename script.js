var username = prompt('Pls enter your username',"name");
var ws = new WebSocket("ws://127.0.0.1:8964");

ws.onmessage = function(event){
    data = JSON.parse(event.data);
    var sender , user_name , name_list , change_type;
    switch (data.type){
        case 'handshake':
            var user_info = {
                'type':'login',
                'content':username
            }
            sendMsg(user_info);
            return;
        case 'user':
            sender = data.from + ':';
            break;
        case 'system':
            sender = 'system message: ';
            break;    
        case 'login':
        case 'logout':
            user_name = data.content;
            name_list = data.user_list;
            change_type = data.type;
            dealUser(username,change_type,name_list);
            return;    
    }
    var msg = sender + data.content;
    listMsg(msg);  
}; 

function dealUser(user_name,type,name_list){
    var user_list = document.getElementById("user_list");
    var user_num = document.getElementById("user_num")

    while (user_list.hasChildNodes()){
        user_list.removeChild(user_list.firstChild);
    };

    for (var index in name_list){
        var user = document.createElement("p");
        user.innterHTML = name_list[index];
        user_list.appendChild(user);
    };

    user_num.innerHTML = name_list.length;
    user_list.scrollTop = user_list.scrollHeight;

    var change = type;

    var msg = 'system message: ' + user_name + 'has' + change;
    listMsg(data)
};

function listMsg(msg){
    var data_list = document.getElementById("msg_list")
    var data = document.createElement("p");

    data.innerHTML = msg;
    data_list.appendChild(data);
    data_list.scrollTop = data_list.scrollHeight;
};

function sendMsg(msg){
    var data = JSON.stringify(msg);
    ws.send(data);
};

window.onbeforeunload = function(){
    var user_info = {
        'type': 'logout',
        'content': 'username'
    }
    sendMsg(user_info);
    ws.close();
};

ws.onerror = function(){
    var msg = "system message : error";
    listMsg(msg)
};

ws.onopen = function(){
    var data = "system message : connect success";
    listMsg(data);
};

function send(){
    var msg_box = document.getElementById("msg_box");
    var content = msg_box.value;
    var reg = new RegExp("\r\n", "g");
    content = content.replace(reg, "");
    var msg = {
        'content': content.trim(),
        'type': 'send'
    }
    sendMsg(msg);
    msg_box.value = '';
}