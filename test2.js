/*global console*/
	var yetify = require('yetify'),
   // config = require('getconfig'),
    uuid = require('node-uuid');
    crontab = require('node-crontab');
	var express = require('express')
   ,app = express()
  , httpapp = express()
  , fs = require('fs')  
  , http = require('http').createServer(httpapp)
  //, server = require('https').createServer(options, function (req, res) {
//  res.writeHead(200);
 // res.end("hello world\n");
//}

//)

   io = require('socket.io').listen(http);/////wait(server);  
  // console.log('sqlllllllllllllllll');
  io.set('close timeout', 60*60*24);
  io.set('heartbeat interval', 1000000);
  io.set('heartbeat timeout', 1000000);
  //console.log('sqlllllllllllllllll');
  debugger;
 /*  app.get('*',function(req,res){  
  console.log('ss');
    res.redirect('https://127.3.3.1:1337'+req.url)
})*/


//server.listen(1337);
http.listen(8081);
  
   var sql = require('mssql');
   var xml2js = require('xml2js');
   var DBS = new Array();



	
   
   function CreateRoomName()
    {
    
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz????????????????ç???????????????";
        var string_length = 20;
        var randomstring = '';
        var charCount = 0;
        var numCount = 0;

        for (var i = 0; i < string_length; i++) {
            // If random bit is 0, there are less than 3 digits already saved, and there are not already 5 characters saved, generate a numeric value. 
            if ((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
                var rnum = Math.floor(Math.random() * 10);
                randomstring += rnum;
                numCount += 1;
            } else {
                // If any of the above criteria fail, go ahead and generate an alpha character from the chars string
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
                charCount += 1;
            }
        }

        return randomstring;
    
    }

	
io.sockets.on('connection', function (client) {
debugger;
console.log('sqlllllllllllllllll');

    client.on('message', function (details) {
        var otherClient = io.sockets.sockets[details.to];
		
		if(UserID==null || typeof UserID == 'undefined')
		{
			
			var command = details.to.split(":"); 
			console.log('innnnnnnnnnnnnnnnnniiiiiiiitial Users'+ UserID+command);
			//return;
		if(command.length>0)
		{
		//if(command[0]=="UserID")
		//console.log('Userssssssssssssssssssssssssss');
			UserID=command[1];
			UserType=command[2];
			DBName =command[3];
			UserData = details.UserData;
			//console.log(UserData);
			try
			{
			UserData.UserOnline = 'Online';
			UserData.online = 'Online';
			UserData.color  = 'Green';
			}catch(e){}
			/*var UserDataObject = details.to.split(":::::"); 
			if(UserDataObject.length>0)
			{
			UserData = JSON.parse(command[1]);
			}*/
			////console.log(details.UserData);
			config.database=DBName;
			//return;
			if(!DBSearch(DBS,DBName))
			{
			DBS.push(DBName);
			InitialUsresStatus();
			}
			
//			io.sockets.emit("ServerCommand",UserID);
//Msg.message = "NewRoom:"+UserID+":"+command[2]+":"++":"+DBName;
Msg.UserData=UserData;
Msg.clientid=client.id;
Msg.NewRoom = CreateRoomName();
Msg.callerID = UserID;
Msg.callerType = command[2];
Msg.DBName =  DBName;
            io.sockets.emit("NewRoom",Msg);
			/*if(UserType=="Service")
		      ExecuteCommand('Update ServiceUsers set IsOnline=1 where ID='+UserID);
		      else if(UserType=="Staff")
		      ExecuteCommand('Update StaffUsers set IsOnline=1 where ID='+UserID);
		      else
		      ExecuteCommand('Update FriendsAndFamilyUsers set IsOnline=1 where ID='+UserID);*/
			  
			  SwitchUserStatus(UserID, UserType, true, false);
			  
//Msg.message = "UserStatus:"+UserID+":"+UserType+":"+DBName;
Msg ={};
Msg.UserData=UserData;
Msg.UserStatus='Online';
Msg.color= 'Green';
Msg.callerID=UserID;
Msg.UserIsBusy = false;
Msg.callerType=UserType;
Msg.DBName = DBName;
io.sockets.emit("UserStatus",Msg);			
		}
		}
		
       // //console.log(details);
       

        if (!otherClient) {
            return;
        }
        delete details.to;  
		////console.log(UserData);
        details.from = client.id;
		details.UserData=UserData;
        otherClient.emit('message', details);
    });

	client.on('Command', function (msg) {
	var command='';
	try
	{
	command = Msg.message.split(":"); 
	}catch(e){return;}
	Msg.message = msg.message+":"+DBName;
	Msg.UserData=UserData;
	Msg.ReceiverData = msg.ReceiverData;
	Msg.clientid=client.id;
/*	if(command.length>0)
	{
	if(command[0]=="connected")
			{
				//console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY');
				config.database=DBName;
				ExecuteCommand("select * from  [dbo].[eCHCheckVideoCallPermission]("+UserID+","+Msg.ReceiverData.ID+")",function(record){
				
				//console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyzzzzzzzzzzzzz'+record[0].Allowcallme);
				if(record[0].Allowcallme==false)
				{
				Msg.message = "UserOffline"+":"+command[1]+":"+command[2]+":"+command[3]+":"+command[4]+":"+DBName;
				io.sockets.emit("ServerCommand",Msg);
				}
				else				
				io.sockets.emit("ServerCommand",Msg);
				}
				
				);
				return;
			}
	}*/
	//if(command[0]!="CheckPermission")
        io.sockets.emit("ServerCommand",Msg);
		//io.sockets.emit("users_count",UserID);
		
		if(command.length>0)
		{
		if(command[0]=="UserID")
		{
			UserID=command[1];
			Msg.message = UserID+":"+DBName;
			Msg.UserData=msg.UserData;
			
			
			io.sockets.emit("ServerCommand",Msg);
		}
			if(command[0]=="CheckPermission")
			{
			//console.log('PeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrmissssssssssonUUUUUUUUUUUU');
			//console.log(Msg.UserData);
			if(Msg.UserData!=undefined)
			{
				CheckVideoCallPermission(UserID,command[1],command[2],DBName,Msg.UserData);
			}
			//console.log('PeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrmissssssssssonRRRRRRRRRR');
			if(Msg.ReceiverData!=undefined && Msg.UserData!=undefined)
			{
				CheckVideoCallPermission(UserID,Msg.UserData.ID,Msg.UserData.UserType,DBName,Msg.ReceiverData);
			}
			}
			
		}
		
    });
	
	client.on('SwitchCamera', function (data) {
	io.sockets.emit('SwitchCamera', data)
	});
	
	client.on('JoinAgain', function (data) {
	io.sockets.emit('JoinAgain', data)
	});
	
	client.on('UpdateConversation', function (data) {
	io.sockets.emit('UpdateConversation', data)
	});
	
	client.on('UpdateMessage', function (data) {
	io.sockets.emit('UpdateMessage', data)
	});
	
	client.on('JoinWellTogether', function (data) {
	io.sockets.emit('JoinWellTogether', data)
	});
	
	client.on('UpdateWellnessLibraryFolder', function (data) {
	io.sockets.emit('UpdateWellnessLibraryFolder', data)
	});
	
	client.on('UpdateWellnessLibraryFile', function (data) {
	io.sockets.emit('UpdateWellnessLibraryFile', data)
	});
	
	
	client.on('AddNewWellnessReminder', function (data) {
		 var connection = new sql.Connection(config, function(err) {
			 
		 var request = new sql.Request(connection); 
		request.query("select dbo.SetDateWithCronMethod("+data.ReminderData.ID+") as result", function(err, recordset) {
	 if(recordset.length>0)
	 {
		result = recordset[0].result.split(':');
		console.log(result);
		var jobId = crontab.scheduleJob(result[0], function(){ 
			
			var Data={};
			Data.UserID = data.receiverID;
			Data.UserType = data.receiverType;
			Data.ReminderTrigger={};
			Data.ReminderTrigger.ID=5000;
			Data.ReminderTrigger.ReminderId = data.ReminderData.ID;
			Data.ReminderTrigger.TriggerDate = data.ReminderData.ReminderDate;
			if(result.length>1)
				Data.ReminderTrigger.Text = result[1];
			Data.ReminderTrigger.ConfirmationDate = null;
			io.sockets.emit('UpdateWellnessReminder', Data)
		});
	 }
	});
	});
	});
	
	client.on('LeaveConversation', function (data) {
	io.sockets.emit('LeaveConversation', data)
	});
	
	client.on('DeleteConversation', function (data) {
	io.sockets.emit('DeleteConversation', data)
	});
	
	client.on('EditPermission', function (data) {
	io.sockets.emit('EditPermission', data)
	});
	
	client.on('WellnessUpdatemeasure', function (data) {
	io.sockets.emit('WellnessUpdatemeasure', data)
	});
	
	client.on('UserOffline', function (data) {
	io.sockets.emit('UserOffline', data)
	});
	
	client.on('UserStatus', function (data) {
	io.sockets.emit('UserStatus', data)
	});
	
	client.on('PrescribeFolder', function (data) {
	io.sockets.emit('PrescribeFolder', data)
	});
	
	client.on('PrescribeFile', function (data) {
	io.sockets.emit('PrescribeFile', data)
	});
	
	client.on('AddFolder', function (data) {
	io.sockets.emit('AddFolder', data)
	});
	
	client.on('UpdateServiceUserFolder', function (data) {
	io.sockets.emit('UpdateServiceUserFolder', data)
	});
	
	client.on('FileDeleted', function (data) {
	io.sockets.emit('FileDeleted', data)
	});
	
	client.on('UpdateFolder', function (data) {
	io.sockets.emit('UpdateFolder', data)
	});
	
	client.on('UpdateUserData', function (data) {
	io.sockets.emit('UpdateUserData', data)
	});
	
	client.on('UpdateFiles', function (data) {
	io.sockets.emit('UpdateFiles', data)
	});
	
	client.on('connected', function (data) {
	data.UserData = UserData;
	io.sockets.emit('connected', data)
	});
	
	client.on('conference', function (data) {
	data.clientid = client.id;
	io.sockets.emit('conference', data)
	});
	
	client.on('Reject', function (data) {
	data.UserData = UserData;
	io.sockets.emit('Reject', data)
	});
	
	client.on('EndCall', function (data) {
	io.sockets.emit('EndCall', data)
	});
	
	client.on('EventConfirmedByUser', function (data) {
	io.sockets.emit('EventConfirmedByUser', data)
	});
	
	client.on('EventConfirmed', function (data) {
	io.sockets.emit('EventConfirmed', data)
	});
	
	client.on('NoBusy', function (data) {
	SwitchUserStatus(UserID, UserType, true, false);
		Msg ={};
Msg.UserData=UserData;
Msg.UserStatus='Online';
Msg.color= 'Green';
Msg.callerID=UserID;
Msg.UserIsBusy = false;
Msg.callerType=UserType;
Msg.DBName = DBName;
io.sockets.emit("UserStatus",Msg);
	});
	
	client.on('Missed', function (data) {
	io.sockets.emit('Missed', data)
	});
	
	client.on('ContactDeleted', function (data) {
	io.sockets.emit('ContactDeleted', data)
	});
	
	client.on('noAnswer', function (data) {
	data.UserData = UserData;
	io.sockets.emit('noAnswer', data)
	});
	
	client.on('GetNewRoom', function (data) {
	Msg.UserData=UserData;
	Msg.clientid=client.id;
	Msg.NewRoom = CreateRoomName();
	Msg.DBName =  DBName;
    io.sockets.emit("NewRoom",Msg);
	});
	
    client.on('join', function (name) {
	
	io.sockets.emit("users_count",40)
    //console.log(name);
    //console.log(client.id);
    client.send('Hello client');
        client.join(name);
        io.sockets.in(name).emit('joined', {
            room: name,
            id: client.id,
			UserData : UserData
        });
		SwitchUserStatus(UserID, UserType, true, true);
		Msg ={};
Msg.UserData=UserData;
Msg.UserStatus='Online';
Msg.color= 'Green';
Msg.callerID=UserID;
Msg.UserIsBusy = true;
Msg.callerType=UserType;
Msg.DBName = DBName;
io.sockets.emit("UserStatus",Msg);
    });

    function leave() {
        var rooms = io.sockets.manager.roomClients[client.id];
        for (var name in rooms) {
            if (name) {
			console.log(name+' dellllllllllllllllllllllleted');
                io.sockets.in(name.slice(1)).emit('left', {
                    room: name,
                    id: client.id,
					UserData : UserData
                });
            }
        }
		
	}


    function leaveCustomRoom(room) {
	//leave();
	//return;
        var rooms = io.sockets.manager.roomClients[client.id];
		//console.log('Leeeeeeeeeeeeeave ::::: '+room);
        for (var name in rooms) {
        //console.log(name);
            if (name==room) {
			console.log(name+' dellllllllllllllllllllllleted');
                io.sockets.in(name.slice(1)).emit('left', {
                    room: name,
                    id: client.id,
					UserData : UserData
                });
            }
        }
		SwitchUserStatus(UserID, UserType, true, false);
		Msg ={};
Msg.UserData=UserData;
Msg.UserStatus='Online';
Msg.color= 'Green';
Msg.callerID=UserID;
Msg.UserIsBusy = false;
Msg.callerType=UserType;
Msg.DBName = DBName;
io.sockets.emit("UserStatus",Msg);
    }

    client.on('disconnect', function(){
	debugger;
	console.log('Leeeeeeeeeeeeeavevvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
	leave();
	config.database=DBName;
		/*if(UserType=="Service")
		      ExecuteCommand('Update ServiceUsers set IsOnline=0 where ID='+UserID);
		      else if(UserType=="Staff")
		      ExecuteCommand('Update StaffUsers set IsOnline=0 where ID='+UserID);
		      else
		      ExecuteCommand('Update FriendsAndFamilyUsers set IsOnline=0 where ID='+UserID);*/
			  
			  SwitchUserStatus(UserID, UserType, false, false);
			  
		 Msg ={};
Msg.UserData=UserData;
Msg.UserStatus='Offline';
Msg.color= 'Red';
Msg.callerID=UserID;
Msg.UserIsBusy = false;
Msg.callerType=UserType;
Msg.DBName = DBName;
         io.sockets.emit("UserStatus",Msg);	
		//console.log('Leeeeeeeeeeeeeave '+UserID+UserType);
		//Msg.message = "UserLogOut:"+UserID+":"+UserType+":"+DBName;
		//Msg.UserData=UserData;
		//io.sockets.emit("ServerCommand",Msg);
			// client.close();
	});
    client.on('leave', function(name){leaveCustomRoom(name);
	leave();
	});

    client.on('create', function (name, cb) {
        if (arguments.length == 2) {
            cb = (typeof cb == 'function') ? cb : function () {};
            name = name || uuid();
        } else {
            cb = name;
            name = uuid();
        }
        // check if exists
        if (io.sockets.clients(name).length) {
            cb('taken');
        } else {
            client.join(name);
			////console.log('room '+name);
            if (cb) cb(null, name);
        }
    });
});


//if (config.uid) process.setuid(config.uid);
////console.log(yetify.logo() + ' -- signal master is running at: http://localhost:' + config.server.port);