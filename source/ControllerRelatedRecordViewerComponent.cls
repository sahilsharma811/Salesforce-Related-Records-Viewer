public class ControllerRelatedRecordViewerComponent {
    
    @AuraEnabled
    public static List<wrapperObjectDetail> fetchWrapperObjectDetail(){
        List<wrapperObjectDetail> listWrapperObjectDetails = new List<wrapperObjectDetail>();
        Map<String, Schema.SObjectType> mapGlobalDescribe = Schema.getGlobalDescribe();
        for(String objName : mapGlobalDescribe.KeySet()){
            String objLabel = mapGlobalDescribe.get(objName).getDescribe().getLabel();
            listWrapperObjectDetails.add(new wrapperObjectDetail(objLabel, String.valueOf(mapGlobalDescribe.get(objName))));
        }
        return listWrapperObjectDetails;
    }
    
    @AuraEnabled
    public static List<wrapperFieldList> fetchObjectDetails(String nameObj){
        if(nameObj != Null && !String.isEmpty(nameObj) && Schema.getGlobalDescribe().containsKey(nameObj)){
            Map<String, Schema.SObjectField> mapSObjectField = Schema.getGlobalDescribe().get(nameObj).getDescribe().fields.getMap();
            if(mapSObjectField != Null){
                List<wrapperFieldList> lstWrapperFieldList = new List<wrapperFieldList>();
                for(Schema.SObjectField objField : mapSObjectField.Values()){
                    Schema.DescribeFieldResult fieldDescribe = objField.getDescribe();
                    lstWrapperFieldList.add(new wrapperFieldList(fieldDescribe.getLabel(),fieldDescribe.getName(), String.valueOf(fieldDescribe.getType()) ,fieldDescribe.isCustom()));
                }
                return lstWrapperFieldList;
            }
        }
        
        return null;
    }
    
    @AuraEnabled
    public static List<wrapperChildRelationship> fetchChildRelationships(String objName){
        List<wrapperChildRelationship> lstWrapperChildRelationship = 
            new List<wrapperChildRelationship>();
        if(objName != Null && !String.isEmpty(objName) && Schema.getGlobalDescribe().containsKey(objName)){
            List<Schema.ChildRelationship> childRelationShips = Schema.getGlobalDescribe().get(objName).getDescribe().getChildRelationShips();
            for(Schema.ChildRelationship objChildRelationship : childRelationShips){
                if(objChildRelationship.getRelationshipName() != Null){
                    String objLabel = objChildRelationship.getChildSObject().getDescribe().getLabel();
                    lstWrapperChildRelationship.add(new wrapperChildRelationship(objChildRelationship.getRelationshipName(),
                                                                                 String.valueOf(objChildRelationship.getChildSObject()),
                                                                                 objLabel));
                }
            }
        }
        
        return lstWrapperChildRelationship;
    }
    
    @AuraEnabled 
    public static List<List<SObject>> fetchSObjectRecords(String objId, String objName, String childRelationshipName, List<String> commaSeparatedFields){
        system.debug(commaSeparatedFields);
        if(objId == Null || childRelationshipName == Null || commaSeparatedFields == Null || objName == Null)
            return null;
        String fields = '';
        for(String fieldName : commaSeparatedFields){
            fields = fields + fieldName + ',';
        }
        fields = fields.removeEnd(',');
        List<SObject> lstSObjectRecord = new List<SObject>();
        String query = 'SELECT Id, (SELECT Id, ' + fields + ' FROM ' + childRelationshipName + ') FROM ' +  objName + ' WHERE Id =: objId';
        system.debug('Query is: ' + query);
        List<List<SObject>> lstChildObjectRecord = new List<List<SObject>>();
        try{
            lstSObjectRecord = Database.query(query);
            for(SObject objChild : lstSObjectRecord){
                lstChildObjectRecord.add(objChild.getSObjects(childRelationshipName));
            }
            system.debug('Child Records : ' + lstSObjectRecord);
            system.debug('Child Record 1' + lstSObjectRecord[0].getSObjects('contacts'));
        }
        catch(Exception ex){
            system.debug(ex);
            return Null;
        }
        return lstChildObjectRecord;
    }
    
    @AuraEnabled
    public static List<SObject> fetchSelectedObjectRecords(String objName){
        String query = 'SELECT Id, Name FROM ' + objName + ' LIMIT 30';
        List<SObject> lstSObjectRecords = Database.query(query);
        system.debug(lstSObjectRecords);
        return lstSObjectRecords;
    }
    
    public class wrapperObjectDetail{
        @AuraEnabled public String objectLabel;
        @AuraEnabled public String objectAPIName;
        public wrapperObjectDetail(String objectLabel, String objectAPIName){
            this.objectLabel = objectLabel;
            this.objectAPIName = objectAPIName;
        }
    }
    public class wrapperFieldList{
        @AuraEnabled public String label;
        @AuraEnabled public String value;
        @AuraEnabled public boolean isCustom;
        @AuraEnabled public String dataType;
        
        public wrapperFieldList(String fieldLabel, String fieldAPIName, String dataType, boolean isCustom){
            this.label = fieldLabel;
            this.value = fieldAPIName;
            this.dataType = dataType;
            this.isCustom = isCustom;
        }
    }
    public class wrapperChildRelationship{
        @AuraEnabled public String childRelationShipName;
        @AuraEnabled public String childSObject;
        @AuraEnabled public String childObjLabel;
        
        public wrapperChildRelationship(String childRelationShipName, String childSObject, String childObjLabel){
            this.childRelationShipName = childRelationShipName;
            this.childSObject = childSObject;
            this.childObjLabel = childObjLabel;
        }
    }
}