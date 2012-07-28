/*
		-------	TODO -------
			
	- if user is not a member, update at hour+10 minutes
	- all entry datas in tooltip
	- menu option to disable statusbar

*/


var DPC_Overlay =
{
	currentTimeout : null,
	lastChallenges : null,
	updateUrlForMembers : "http://www.dpchallenge.com/challenge_stats.php?action=update",
	updateUrlForUsers : "http://www.dpchallenge.com/index.php",
	updateUrl : "",
	
	challengeObject : function (challengeName,nbVotes,score)
	{
		this.name = challengeName
		this.nbVotes = nbVotes
		this.score = score
	},
	
	DPC_Startup : function()
	{
		DPC_Overlay.updateUrl = DPC_Overlay.updateUrlForMembers;
		DPC_Overlay.lastChallenges=new Array();
		DPC_Preference.DPC_InitPref();
		try {
			DPC_Preference.DPC_Pref.getBoolPref("DPCupdate.AutoUpdateEnabled")
		} catch (e)
		{
			DPC_Preference.DPC_Pref.setBoolPref("DPCupdate.AutoUpdateEnabled",false)
		}

		try {
			DPC_Preference.DPC_Pref.getIntPref("DPCupdate.delaySeconds")
		} catch (e)
		{
			DPC_Preference.DPC_Pref.setIntPref("DPCupdate.delaySeconds",60)
		}

		if (DPC_Preference.DPC_Pref.getBoolPref("DPCupdate.AutoUpdateEnabled")) {
			var OGC_Statusbar_Timer = setTimeout("DPC_Overlay.StatusBarUpdate()", 10);
		} else {
			document.getElementById("dpc-status").label = "Update disabled. Click here to update.";
		}
	},
	
	getUpdateDelay : function () 
	{
		return DPC_Preference.DPC_Pref.getIntPref("DPCupdate.delaySeconds")*1000;
	},
	
	MouseClick : function(event) 
	{
		if (event.button == 0)
		{
			DPC_Overlay.StatusBarUpdate();
		}
	},
	
	StatusBarUpdate : function() 
	{	
		document.getElementById("dpc-status").hidden = false;
		document.getElementById("dpc-status").label = "Checking status.";

		var req = new XMLHttpRequest();

		req.onreadystatechange = function (event) {
				if (this.readyState == 4) {
					
					try {
						if (this.status == 200){
							try {
							
								var reg1=new RegExp("(logout.php)","g");
								
								if (this.responseText.match(reg1)) 
								{
									reg1=new RegExp("(My Submissions)","g");
									if (this.responseText.match(reg1)) 
									{
										document.getElementById("dpc-status").hidden = true;
									
										document.getElementById("dpc-status").label = "";
										document.getElementById("dpc-status").setAttribute("tooltiptext","");
										
										var endIndex=0;
										var startIndex=0;
										var tempStr="";
										var challengeName="";
										var score="";
										var challengeTooltip="";
										var node;
										var nbVotes;
										var nbViews;
										var nbFaves;
										var currentChallenges=new Array();
										var currentCh;
										var trendTooltip;
										var nbNewVotes;
										var newVotesAvg;
										
										endIndex = this.responseText.indexOf("Updated",endIndex+1);

										DPC_Overlay.DPC_RemoveChallengeNodes();

										while (endIndex>=0) {
											challengeTooltip="";
											startIndex = this.responseText.indexOf("class=\"i\" href=\"challenge_stats.php?action=comments&IMAGE_ID",startIndex+1);
											
											tempStr = this.responseText.substring(startIndex,endIndex);
											tempStr = tempStr.substring(tempStr.indexOf("challenge_vote_list.php?CHALLENGE_ID"),tempStr.length);
											challengeName = tempStr.substring(tempStr.indexOf(">")+1,tempStr.indexOf("<"));
											tempStr = tempStr.substring(tempStr.indexOf("Votes"),tempStr.length);
											nbVotes = tempStr.substring(tempStr.indexOf("<b>")+3,tempStr.indexOf("</b>"));
											tempStr = tempStr.substring(tempStr.indexOf("Views"),tempStr.length);
											nbViews=tempStr.substring(tempStr.indexOf("<b>")+3,tempStr.indexOf("</td>",11));
											tempStr = tempStr.substring(tempStr.indexOf("Avg Vote"),tempStr.length);
											score = tempStr.substring(tempStr.indexOf("<b>")+3,tempStr.indexOf("</b>"));
//											tempStr = tempStr.substring(tempStr.indexOf("Comments"),tempStr.length);
//											challengeTooltip += "Comments : " +tempStr.substring(tempStr.indexOf("<b>")+3,tempStr.indexOf("</b>"))+"\n";
											tempStr = tempStr.substring(tempStr.indexOf("Favorites"),tempStr.length);
											nbFaves = tempStr.substring(tempStr.indexOf("<b>")+3,tempStr.indexOf("</td>",14));

											challengeTooltip += "Votes : " +nbVotes+"\n";
											challengeTooltip += "Views : " +nbViews+"\n";
											challengeTooltip += "Favorites : " +nbFaves+"\n";
											currentCh=new DPC_Overlay.challengeObject(challengeName,nbVotes,score);
											currentChallenges.push(currentCh);
											
											node = document.createElement("caption");
											node.setAttribute("id", challengeName);
											node.setAttribute("label", challengeName+" : "+score);
											node.setAttribute("onmousedown","DPC_Overlay.MouseClick(event);");
											node.setAttribute("tooltiptext", challengeTooltip);
											document.getElementById("dpc-status-bar").appendChild(node);
											node = document.createElement("image");
											node.setAttribute("id", challengeName+" trend");
											document.getElementById("dpc-status-bar").appendChild(node);

											for each(old in DPC_Overlay.lastChallenges) {
												if (old.name == challengeName) {
													nbNewVotes=nbVotes-old.nbVotes;
													trendTooltip="Since last update\nNew votes : "+(nbVotes-old.nbVotes)+"\n";
													if (nbNewVotes>0) {
														newVotesAvg=((score*nbVotes) - (old.score*old.nbVotes))/nbNewVotes;
														tempStr=newVotesAvg+"";
														trendTooltip+="New votes avg : "+tempStr.substring(0,6)+"\n";
													}

													if(score>old.score) {
														document.getElementById(challengeName+" trend").setAttribute("class", "dpc-score-up");
													}
													else if (score<old.score) {
														document.getElementById(challengeName+" trend").setAttribute("class", "dpc-score-down");
													} else {
														document.getElementById(challengeName+" trend").setAttribute("class", "");
													}
													document.getElementById(challengeName+" trend").setAttribute("tooltiptext", trendTooltip);
												}
											}

											

											endIndex = this.responseText.indexOf("Updated",endIndex+1);
										}

										
										
										DPC_Overlay.lastChallenges=new Array();
										for each(cur in currentChallenges) {
											DPC_Overlay.lastChallenges.push(cur);
										}
										

										
									}
									else
									{
									reg1=new RegExp("(select a membership option)","g");
										if (this.responseText.match(reg1)) {
											DPC_Overlay.updateUrl = DPC_Overlay.updateUrlForUsers;
											setTimeout("DPC_Overlay.StatusBarUpdate()", 10);
										} else {
											DPC_Overlay.DPC_RemoveChallengeNodes();
											DPC_Overlay.lastChallenges = new Array();
											document.getElementById("dpc-status").label = "No submissions.";
											document.getElementById("dpc-status").setAttribute("tooltiptext","If you entered a challenge ... this is a bug.");
										}
									}
								} else {
									document.getElementById("dpc-status").label = "You are not logged in.";
									document.getElementById("dpc-status").setAttribute("tooltiptext","Log on dpchallenge.com to get your score here.");
								}
							
							} catch (e) {}
						}
						else {
						}
					}
					catch (e) {}
				}
			};
		req.open("GET",this.updateUrl,true);
//		req.open("GET", "http://192.168.137.13/dpc.html", true);
		req.send(null);
		
		if (DPC_Preference.DPC_Pref.getBoolPref("DPCupdate.AutoUpdateEnabled"))
		{
			if (DPC_Overlay.currentTimeout)
				clearTimeout(DPC_Overlay.currentTimeout);
			DPC_Overlay.currentTimeout = setTimeout("DPC_Overlay.StatusBarUpdate()", DPC_Overlay.getUpdateDelay());
		}
	},

	DPC_RemoveChallengeNodes : function() 
	{
		if (DPC_Overlay.lastChallenges.length>0) {
			var old;
			var node;
			for each(old in DPC_Overlay.lastChallenges){
				node = document.getElementById(old.name);
				document.getElementById("dpc-status-bar").removeChild(node);
				node = document.getElementById(old.name+" trend");
				document.getElementById("dpc-status-bar").removeChild(node);
			}
		}
	},
	
	DPC_OpenPrefsDialog : function() 
	{       		
		window.openDialog("chrome://dpc/content/DPC_Option.xul", "", "chrome, centerscreen, modal=yes");  
	},
	
	DPC_Login : function() 
	{
		gBrowser.loadOneTab("https://www.dpchallenge.com/login.php", null, null, null, false, false);
	},
	
	DPC_AuthorHomePage : function()
	{
		window.opener.gBrowser.loadOneTab("http://keyz.dpchallenge.com/", null, null, null, false, false);
	},
}

addEventListener("load", DPC_Overlay.DPC_Startup, false);
