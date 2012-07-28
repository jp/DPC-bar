var DPC_Preference =
{
	DPC_Pref : null,
	
	DPC_InitPref : function() {
		const DPC_PrefService = Components.classes["@mozilla.org/preferences-service;1"]
						.getService(Components.interfaces.nsIPrefService); 
	
		this.DPC_Pref = DPC_PrefService.getBranch("extensions.dpc.");
	},
	
	DPC_GUI_Init: function() {
		if (!DPC_Preference.DPC_Pref) DPC_Preference.DPC_InitPref();
		document.getElementById("checkboxAllowUpdateMode").setAttribute("checked", DPC_Preference.DPC_Pref.getBoolPref("DPCupdate.AutoUpdateEnabled"));
		if (document.getElementById("checkboxAllowUpdateMode").checked)
		{
			document.getElementById("DPCUpdateSeconds").disabled = false;
		}
		else
		{
			document.getElementById("DPCUpdateSeconds").disabled = true;
		}
		document.getElementById("DPCUpdateSeconds").value = DPC_Preference.DPC_Pref.getIntPref("DPCupdate.delaySeconds");
	},

		
	DPC_Close: function() {
		DPC_Preference.DPC_Pref.setBoolPref("DPCupdate.AutoUpdateEnabled", document.getElementById("checkboxAllowUpdateMode").checked);
		DPC_Preference.DPC_Pref.setIntPref("DPCupdate.delaySeconds",document.getElementById("DPCUpdateSeconds").value);
		if (DPC_Preference.DPC_Pref.getBoolPref("DPCupdate.AutoUpdateEnabled")) {
			window.opener.DPC_Overlay.StatusBarUpdate();
		}
	},
	
	DPC_CheckboxAllowUpdate: function() {
		if (document.getElementById("checkboxAllowUpdateMode").checked)
		{
			document.getElementById("DPCUpdateSeconds").disabled = false;
		}
		else
		{
			document.getElementById("DPCUpdateSeconds").disabled = true;
		}
	},

}
