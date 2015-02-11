
    //-----------------
    //Properties
    //-----------------
    
    //Warband Storage Containers
    var army = {};
    army.group = [];//array of units: Leader is always [0], followed by heroes, followed by henchman, followed by Hired Sword... priority based on 'orcmob.[name].info.order'
    /*What all is stored for each Unit:
     *army.group[0].info.order =0;          //Boss0, Shaman1, BigUn2, Orc3, Goblin4, Squig5, Troll6 - used as priority in the army.group[] array as just mentioned.
     *army.group[0].info.wtype = 2;         //AllOrcs2, Goblins1, Squig/Troll0 = Weapon list avalible for this model
     *army.group[0].info.rating = 25;       //base rating including inicial xp
     *army.group[0].info.cost = 80;         //base cost excluding weapons...
     *army.group[0].info.max = 1;           //max group size
     *army.group[0].info.maxGroups = 1;     //max # of groups
     *army.group[0].info.race = "Orcish";   //used to make sure 1 Orcish per 2 Goblin 
     *army.group[0].info.name = "Boss";     //Spelling "Big'Un" Not "BigUn"
     *army.group[0].type = "Boss"           //Type "BigUn"  no '           
     *army.group[0].quantity = 1;           //Current Number of models in this unit
     *army.group[0].weaponIndex = 0;        //Current Selected Wepon
     *army.group[0].weaponCost = 0;         //Current Cost of Weapon per model
     */
    
    //Fixed Properties
    army.warband = orcmob;//use army.warband instead of orcmob so can use different warbands later...
    army.maxsize = 20;//can increase beyond this with Hired Sword/Cookbook
    army.maxheroes = 6;//True for every warband
    
    //Changing Properties:
    army.curIndex = -1;//index in array 'army.group' of last group (same as: army.group.length - 1)
    army.name = "";
    army.gold = 500;
    army.rating = 0;
    army.size = 0;
    
    //Possibly Add Later:
    //army.numOfHeroes = 0;   //# of Heroes (Including Leader)
    //army.numOfHechGroups = function(){};//# of Groups, not individuals
    //army.heroes = function(){}//array of hero groups (excluding leader)
    //army.hench = function(){};//array of henchman groups
    
    //-----------------
    //Private Functions
    //-----------------
    
    //inserts newGuy into correct possition of army.group[]
    //returns index where newGuy is located
    //Only called internally by army.addGroup()
    army.insert = function (newGuy) {
        //find where to insert newGuy (index)
        for(var index = 0; index<=army.curIndex; index++){
            if (army.group[index].info.order > newGuy.info.order) {
                break;
            }
        }
        //insert newGuy at position 'index'
        if (index == army.curIndex+1) {
            //alert("adding element way 1:push");
            army.group.push(newGuy);
        }else{
            //alert("adding element way 2:splice. index="+index);
            army.group.splice(index, 0, newGuy);//modifies army.group directly
        }
        return index;
    };
    
    //-----------------
    //Public Functions
    //-----------------
    //Makes if faster to give everyone Duel Wield in one button click
    army.daggersPlease = function(){
        
        for(var i = 0; i<=army.curIndex;i++){
            if (army.group[i].weaponIndex==0 && army.group[i].info.wtype != 0) {
                army.changeWeapon( i, 1);
            }
        }
    }
    
    ////for requirement : 1 Orc per 2 Gob drop down
    army.goblinCount = function(){
        var goblins = 0;
        for(var i = 0; i<=army.curIndex;i++){
            if (army.group[i].type == "Goblin"){ 
                goblins+= army.group[i].quantity;    
            }
        }
        return goblins;
    }
    //for requirement : Group up Goblins -- returns "valid","invalid", or "yellow"
    army.gotGroupedGoblins = function(){
        var goblinGroups = 0;
        var goblins = 0;
        var size;
        for(var i = 0; i<=army.curIndex;i++){
            if ( army.group[i].type == "Goblin") {
                size = army.group[i].quantity;
                goblins += size;
                if (size>0) {
                    goblinGroups++;
                }
            }
        }
        if ( Math.ceil( goblins /5) == goblinGroups) {
            return "valid";
        }else if ( Math.ceil((goblins+1)/5) == goblinGroups) {
            return "yellow";
        }
        return "invalid";
    }
    //for requirement : dual wield -- returns "valid","invalid", or "yellow"
    army.gotDualWield = function(){
        var numNot = 0;
        for(var i = 0; i<=army.curIndex;i++){
            if (army.group[i].info.wtype != 0) { //don't count Trolls / Squigs
                if ( army.group[i].weaponIndex == 0) {
                    numNot+= army.group[i].quantity;
                }
            }
        }
        if (numNot > 1) {
            return "invalid";
        }else if(numNot == 1){
            return "yellow";
        }
        return "valid";
    }
    //for requirement : Maximize Orc Promotions -- returns "valid","invalid", or "yellow"
    army.gotPromotions = function (){
        var orcGroups = 0;
        var orcs = 0;
        var size;
        for(var i = 0; i<=army.curIndex;i++){
            if( army.group[i].type == "Orc") {
                size = army.group[i].quantity;
                orcs+= size;
                if (size>0) {
                    orcGroups++;
                }
            }
        }
        if (orcs > 5 && orcGroups == orcs) {
            return "valid";
        }else if ( (orcs >= 5 && orcGroups >= 5) && (orcs-1 <= orcGroups ) ){
            return "yellow";
        }
        return "invalid";
    }
    //for requirement : A Minimum of 3 Heroes -- returns "valid","invalid", or "yellow"
    army.gotThreeHeroes = function(){
        var heroes = 0;
        for(var i = 0; i<= army.curIndex; i++)
        {
            if ( army.warband.bornHero( army.group[i].type ) && army.group[i].quantity == 1) {
                heroes++;
            }
        }
        if ( heroes > 3) { return "valid"; }
        if ( heroes == 3) { return "yellow"; }
        return "invalid";
    }
    //for requirement : Cheap Weapons! No Armor -- returns "valid","invalid", or "yellow"
    army.gotCheapGear = function(){
        var gearTotalCost = 0;
        for(var i = 0; i<= army.curIndex; i++)
        {
            gearTotalCost += (army.group[i].quantity * army.group[i].weaponCost);
        }
        if ( gearTotalCost <= 75) {
            return (gearTotalCost <= 50) ? "valid" : "yellow";
        }
        return "invalid";
    }
    //for requirement : Shaman
    /*army.gotShaman = function (){
        for(var i = 0; i<=army.curIndex;i++){
            if (army.group[i].type == "Shaman" && army.group[i].quantity != 0) {
                return true;
            }
        }
        return false;
    }*/
    //for requirement : comparing goblin to squig -- returns "valid","invalid", or "yellow"
    army.gotEnoughGoblin = function (){
        var squig = 0;
        var goblin = 0;
        for(var i = 0; i<= army.curIndex; i++){
            if ( army.group[i].info.race == "Goblin") {
                goblin+= army.group[i].quantity;
            }else if( army.group[i].info.race == "CaveSquig") {
                squig+= army.group[i].quantity;
            }
        }
        if ( squig < goblin || squig == 0) {
            return "valid";
        }else if ( squig == goblin) {
            return "yellow";
        }
        return "invalid";
    }
    //for requirement : comparing orcish to goblin -- returns "valid","invalid", or "yellow"
    army.gotEnoughOrcish = function (){
        var orcish = 0;
        var goblin = 0;
        for(var i = 0; i<= army.curIndex; i++){
            if ( army.group[i].info.race == "Goblin") {
                goblin+= army.group[i].quantity;
            }else if( army.group[i].info.race == "Orcish") {
                orcish+= army.group[i].quantity;
            }
        }
        if ( (orcish-1) * 2 >= goblin || goblin == 0) { //6gob 4+Orc,  5gob 4+orc, 4gob 3+orc, 3gob 3+Orc
            return "valid";
        }else if ( orcish *2 >= goblin ) {//6gob 3 Orc,  5gob 3 orc, 4gob 2 orc, 3gob 2 orc
            return "yellow";
        }
        return "invalid";
    }
    
    
    //counts how many of a specific model type there are
    //if groupsF_individualsT == false : returns # of GROUPS of that unit
    //if groupsF_individualsT == true : returns # of INDIVIDUALS of that unit
    //returns # of models
    army.howManyOf = function (type, groupsF_individualsT){
        var count = 0;
        //special case for race:"Orcish" as type
        if ( type == "Orcish") {
            for(var index = 0; index<=army.curIndex; index++){
                if (type == army.group[index].info.race) {
                    if (groupsF_individualsT) {
                        count+= army.group[index].quantity;//all individuals in group
                    } else {
                        count+= 1;//1 groups
                    }
                }
            }
            return count;
        }
        //validate type
        if (army.warband.isOneOfUs(type) == false) {
            //error message
            console.error("army.howManyOf(): invalid type of warband member:"+type);
            return 0;
        }else{
            for(var index = 0; index<=army.curIndex; index++){
                if (type == army.group[index].type) {
                    if (groupsF_individualsT) {
                        count+= army.group[index].quantity;//all individuals in group
                    } else {
                        count+= 1;//1 groups
                    }
                }
            }
            return count;
        }
    }

    
    /* addGroup()
     * where type == 'Orc''Troll''Goblin''Squig''BigUn''Boss''Shaman'
     * return's army.group[#] index where newGuy is located.
     *
     * Adds one Hero or Henchman group into the 'army.group' array
     * Updates the following changing properties: army.gold, army.rating, army.size, army.curIndex, and adds item to army.group
     */
    army.addGroup = function(type){
        //validate type
        if (army.warband.isOneOfUs(type) == false) {
            //error message
            console.error("army.addGroup(): invalid type of warband member:"+type);
            return true;
        }
        //create new Group
        var newGuy = {};
        newGuy.type = type
        newGuy.quantity = 1;
        newGuy.weaponIndex = 0;
        newGuy.weaponCost = 0;
        newGuy.info = army.warband[type];
        //Note: these are now equivalent but use option 3
        //1:       orcmob[ army.group[#].type ]
        //2: army.warband[ army.group[#].type ]
        //3:   army.group[#].info
      //newGuy.class = "henchman or ..."; //class can change... promoted to hero
      
        //add created group to army.group[];
        var newGuyIndex = army.insert(newGuy);
        //update variables
        army.gold-= newGuy.info.cost;
        army.size+= newGuy.quantity;
        army.rating += newGuy.info.rating;
        army.curIndex++;
        
        return newGuyIndex;//army.group[ newGuyIndex ];
    }
    
    //removeGroup()
    //Currently can only remove groups who's quantity is zero
    //returns true if group was removed
    //returns false otherwise
    army.removeGroup = function( index ){
        //check if index out of bounds
        if ( index > army.curIndex ) {
            //error message
            console.error("army.removeGroup(): invalid index:"+index);
            return true;
        }
        if (army.group[index].quantity == 0) {
            army.group.splice(index, 1);//modifies army.group directly
            army.curIndex--;
            return true;
        }
        return false;
    }
    
    //incrementGroup()
    //returns true if group is at max size;
    //returns false otherwise
    army.incrementGroup = function( index){
        //check if index out of bounds
        if ( index > army.curIndex ) {
            //error message
            console.error("army.incrementGroup(): invalid index:"+index);
            return true;
        }
        var model = army.group[index];
        //check if already at max size;
        var max = model.info.max;
        if (model.quantity >= max) {
            //error message goes here
            console.error("army.incrementGroup(): already at max size group:"+model.quantity);
            return true;
        }
        var perUnitcost = model.info.cost + model.weaponCost;/*add XP cost*/
        //update quantity gold rating size
        model.quantity++;
        army.gold -= perUnitcost;
        army.rating += model.info.rating;
        army.size++;
        
        if (model.quantity == max) {
            return true;
        }
        return false;
    }
    
    //decrementGroup()
    //returns true if group is at zero;
    //returns false otherwise
    army.decrementGroup = function( index){
        //check if index out of bounds
        if ( index > army.curIndex ) {
            //error message
            console.error("army.decrementGroup(): invalid index:"+index);
            return true;
        }
        var model = army.group[index];
        //check if already at 0
        if (model.quantity <= 0) {
            //error message goes here
            return true;
        }
        var perUnitcost = model.info.cost + model.weaponCost;/*add XP cost*/
        //update quantity gold rating size
        model.quantity--;
        army.gold += perUnitcost;
        army.rating -= model.info.rating;
        army.size--;
        
        if (model.quantity == 0) {
            return true;
        }
        return false;
    }
    
    //changeWeapon()
    //updates army.group[index].weaponCost, army.group[index].weaponIndex, army.gold
    army.changeWeapon = function( groupIndex, weaponIndex){
        //check if either index out of bounds
        if ( groupIndex > army.curIndex ) {
            //error message
            console.error("army.changeWeapon(): invalid index:"+groupIndex);
            return;
        }
        var model = army.group[groupIndex];
        var weaponCostList = army.warband.weaponlist.cost[ model.info.wtype ];
        if ( weaponIndex > weaponCostList.length ) {
            //error message
            console.error("army.changeWeapon(): invalid weapon index:"+weaponIndex);
            return;
        }
        //update gold / army.group[#].weaponCost / army.group[#].weaponCost
        var newWepCost = weaponCostList[weaponIndex];
        var oldWepCost = model.weaponCost;
        var totalCostDif = (newWepCost - oldWepCost) * model.quantity;
        
        model.weaponCost = newWepCost;
        model.weaponIndex = weaponIndex;
        army.gold -= totalCostDif;
    }
    