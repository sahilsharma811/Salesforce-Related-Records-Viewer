({
	onInit : function(component, event, helper) {
		helper.handleInit(component, event);
	},
    
    onObjectSelection : function(component, event, helper) {
		helper.handleObjectSelection(component, event);
	}, 
    
    onChildObjectSelection : function(component, event, helper){
        helper.handleChildObjectSelection(component, event);
    }, 
    
    onChildObjectFieldChange : function(component, event, helper){
        helper.handleChildObjectFieldChange(component, event);
    }
})