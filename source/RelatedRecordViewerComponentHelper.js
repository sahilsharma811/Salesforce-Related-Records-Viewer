({
    handleInit : function(component, event) {
        var fetchObjectList = component.get('c.fetchWrapperObjectDetail');
        $A.enqueueAction(fetchObjectList);
        
        component.set('v.columns', [
            {label : 'Field Name', fieldName : 'fieldLabel', type : 'String', sortable: true, editable : true},
            {label : 'Field API Name', fieldName : 'fieldAPIName', type : 'String'},
            {label : 'Data Type', fieldName : 'dataType', type : 'String'},
            {label : 'Custom', fieldName : 'isCustom', type : 'boolean'}
        ]);
        
        fetchObjectList.setCallback(this,function(response){
            var state = response.getState();
            if(state == 'SUCCESS'){
                var result = response.getReturnValue();
                component.set('v.lstObjectName', result);
            }
            else if(state == 'INCOMPLETE'){
                
            }
            
                else if(state == 'ERROR'){
                    var errors = response.getError();
                    if(errors){
                        console.log('Error: ' + errors[0] + ' .Error Message: ' + errors[0].message);
                    }
                    else{
                        console.log('Unknown Error');
                    }
                }
        });
    },
    
    handleObjectSelection : function(component, event) {
        component.set('v.showSpinner', true);
        var fetchChildRelationships = component.get('c.fetchChildRelationships');
        if (component.get('v.selectedObject') == '--None--'){
            component.set('v.showChildObjectFieldList', false);
            component.set('v.showChildObjects', false);
            component.set('v.showSpinner', false);
            return;
        }
        fetchChildRelationships.setParams({'objName' : component.get('v.selectedObject')});
        $A.enqueueAction(fetchChildRelationships);
        
        fetchChildRelationships.setCallback(this,function(response){
            var state = response.getState();
            if(state == 'SUCCESS'){
                var result = response.getReturnValue();
                component.set('v.lstChildObjectName',result);
                component.set('v.showChildObjects',true);
                component.set('v.showSpinner', false);
            }
            else if(state == 'INCOMPLETE'){
                component.set('v.showSpinner', false);
            }
            
                else if(state == 'ERROR'){
                    var errors = response.getError();
                    if(errors){
                        console.log('Error: ' + errors[0] + ' .Error Message: ' + errors[0].message);
                        component.set('v.showChildObjects', false);
                        component.set('v.showSpinner', false);
                    }
                    else{
                        console.log('Unknown Error');
                        component.set('v.showChildObjects', false);
                        component.set('v.showSpinner', false);
                    }
                }
        });
    },
    
    handleChildObjectSelection : function(component, event){
    	component.set('v.showSpinner', true);
        var fetchChildObjectDetails = component.get('c.fetchObjectDetails');
        if (component.get('v.selectedChildObjectName') == '--None--'){
            component.set('v.showChildObjectFieldList', false);
            component.set('v.showSpinner', false);
            return;
        }
        fetchChildObjectDetails.setParams({'nameObj' : component.get('v.selectedChildObjectName')});
        $A.enqueueAction(fetchChildObjectDetails);
        
        fetchChildObjectDetails.setCallback(this,function(response){
            var state = response.getState();
            if(state == 'SUCCESS'){
                var result = response.getReturnValue();
                component.set('v.wrapperObjectFields',result);
                component.set('v.showChildObjectFieldList',true);
                component.set('v.showSpinner', false);
            }
            else if(state == 'INCOMPLETE'){
                component.set('v.showSpinner', false);
            }
            
                else if(state == 'ERROR'){
                    var errors = response.getError();
                    if(errors){
                        console.log('Error: ' + errors[0] + ' .Error Message: ' + errors[0].message);
                        component.set('v.showChildObjectFieldList', false);
                        component.set('v.showSpinner', false);
                    }
                    else{
                        console.log('Unknown Error');
                        component.set('v.showChildObjectFieldList', false);
                        component.set('v.showSpinner', false);
                    }
                }
        });    
    }, 
    
    handleChildObjectFieldChange : function(component, event){
        var selectedChildObjectFields = component.get('v.selectedChildObjectFields');
    }
})