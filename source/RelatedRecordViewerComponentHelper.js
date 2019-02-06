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
            component.set('v.showObjectRecordList',false);
            component.set('v.showChildObjectRecords',false);
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
        
        var fetchSelectedObjectRecords = component.get('c.fetchSelectedObjectRecords');
        fetchSelectedObjectRecords.setParams({
            objName : component.get('v.selectedObject')
        });
        $A.enqueueAction(fetchSelectedObjectRecords);
        fetchSelectedObjectRecords.setCallback(this, function(response){
            var state = response.getState();
            if(state == 'SUCCESS'){
                var result = response.getReturnValue();
                component.set('v.SObjectRecords',result);
                component.set('v.showSpinner', false);
            }
            else if(state == 'INCOMPLETE'){
                component.set('v.showSpinner', false);
            }
            
                else if(state == 'ERROR'){
                    var errors = response.getError();
                    if(errors){
                        console.log('Error: ' + errors[0] + ' .Error Message: ' + errors[0].message);
                        component.set('v.showObjectRecordList', false);
                        component.set('v.showSpinner', false);
                    }
                    else{
                        console.log('Unknown Error');
                        component.set('v.showObjectRecordList', false);
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
            component.set('v.showObjectRecordList',false);
            component.set('v.showChildObjectRecords',false);
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
        var objName = component.get('v.selectedObject');
        var selectedChildObjectFields = component.get('v.selectedChildObjectFields');
        if(selectedChildObjectFields == ''){
            component.set('v.showObjectRecordList',false);
            component.set('v.showChildObjectRecords',false); 
            return;
        }
        component.set('v.showChildObjectRecords',false);
        component.set('v.showObjectRecordList', true);
    }, 
    
    handleObjectRecordSelection : function(component, event){
        var selectedChildObjectFields = component.get('v.selectedChildObjectFields');
        var childObjectName = component.get('v.selectedChildObjectName');
        var lstChildObjectName = component.get('v.lstChildObjectName');
        var childRelationshipName = '';
        for(var iter in lstChildObjectName){
            if(lstChildObjectName[iter].childSObject == childObjectName){
                childRelationshipName = lstChildObjectName[iter].childRelationShipName;
            }
        }
        var fetchSObjectRecords = component.get('c.fetchSObjectRecords');
        fetchSObjectRecords.setParams({
            "objId" : component.get('v.idSelectedObject'),
            "objName" : component.get('v.selectedObject'),
            "childRelationshipName" : childRelationshipName,
            "commaSeparatedFields" : selectedChildObjectFields
        });
        $A.enqueueAction(fetchSObjectRecords);
        fetchSObjectRecords.setCallback(this, function(response){
            var state = response.getState();
            if(state == 'SUCCESS'){
                var result = response.getReturnValue();
                if($A.util.isUndefinedOrNull(result)){
                    component.set('v.showChildObjectRecords',false);
                    return;
                }
                console.log(JSON.stringify(result));
                var keys = '';
                var recordList = result[0];
                var recordResult = new Array();
                for(var key in recordList){
                    for(var key2 in result[key]){
                        recordResult.push(result[key][key2]);
                    }
                }
                var mapOfFieldAPIToFieldDetail = [];
                var column = new Array();
                var selectedColumns = component.get('v.selectedChildObjectFields');
                var wrapperObjectFields = component.get('v.wrapperObjectFields');
                for(var key in wrapperObjectFields){
                    if(selectedColumns.indexOf(wrapperObjectFields[key].value) != -1){
                        var newEntry = {};
                        newEntry['label'] = wrapperObjectFields[key].label;
                        newEntry['fieldName'] = wrapperObjectFields[key].value;
                        newEntry['type'] = wrapperObjectFields[key].dataType;
                        column.push(newEntry);
                    }
                }
                component.set('v.columns',column);
                component.set('v.childRecords',recordResult);
                component.set('v.showChildObjectRecords',true);
                component.set('v.showSpinner', false);
            }
            else if(state == 'INCOMPLETE'){
                component.set('v.showSpinner', false);
            }
            
                else if(state == 'ERROR'){
                    var errors = response.getError();
                    if(errors){
                        console.log('Error: ' + errors[0] + ' .Error Message: ' + errors[0].message);
                        component.set('v.showChildObjectRecords', false);
                        component.set('v.showSpinner', false);
                    }
                    else{
                        console.log('Unknown Error');
                        component.set('v.showChildObjectRecords', false);
                        component.set('v.showSpinner', false);
                    }
                }
        });
    }
})