    var orcmob = {};
    //orcmob.Orc = orcmob.Boss = orcmob.Shaman = orcmob.BigUn = orcmob.Squig = orcmob.Goblin = orcmob.Troll = {}; //causes them to all point to same container if done in one line.
    orcmob.Boss = {};
    orcmob.Shaman = {};
    orcmob.BigUn = {};
    orcmob.Orc = {};
    orcmob.Goblin = {};
    orcmob.Squig = {};
    orcmob.Troll = {};
    
    orcmob.Boss.order =0;//0
    orcmob.Boss.wtype = 2;
    orcmob.Boss.rating = 25;
    orcmob.Boss.cost = 80;
    orcmob.Boss.max = 1;
    orcmob.Boss.maxGroups = 1;
    orcmob.Boss.race = "Orcish";
    orcmob.Boss.name = "Boss";
    
    orcmob.Shaman.order = 1;//1
    orcmob.Shaman.wtype = 2;
    orcmob.Shaman.rating = 15;
    orcmob.Shaman.cost = 40;
    orcmob.Shaman.max = 1;
    orcmob.Shaman.maxGroups = 1;
    orcmob.Shaman.race = "Orcish";
    orcmob.Shaman.name = "Shaman";
    
    orcmob.BigUn.order = 2;//2
    orcmob.BigUn.wtype = 2;
    orcmob.BigUn.rating =20;
    orcmob.BigUn.cost = 40;
    orcmob.BigUn.maxGroups = 2;
    orcmob.BigUn.max = 1;
    orcmob.BigUn.race = "Orcish";
    orcmob.BigUn.name = "Big'Un";//added '
    
    orcmob.Orc.order = 3;   //Boss0, Shaman1, BigUn2, Orc3, Goblin4, Squig5, Troll6
    orcmob.Orc.wtype = 2;   //AllOrcs2, Goblins1, Squig/Troll0
    orcmob.Orc.rating = 5;  //base rating excluding xp
    orcmob.Orc.cost = 25;   //base cost excluding weapons / xp
    orcmob.Orc.max = 5;     //max group size
    //orcmob.Orc.maxGroups      //max # of groups
    orcmob.Orc.race = "Orcish";
    orcmob.Orc.name = "Orc";
    
    orcmob.Goblin.order = 4;//4
    orcmob.Goblin.wtype =1;
    orcmob.Goblin.rating=5;
    orcmob.Goblin.cost=15;
    orcmob.Goblin.max=5;
    //orcmob.Goblin.maxGroups
    orcmob.Goblin.race = "Goblin";
    orcmob.Goblin.name = "Goblin";
    
    orcmob.Squig.order =5;//5
    orcmob.Squig.wtype=0;
    orcmob.Squig.rating = 5;
    orcmob.Squig.cost = 15;
    orcmob.Squig.max = 5;
    orcmob.Squig.maxGroups = 1;
    orcmob.Squig.race = "CaveSquig";
    orcmob.Squig.name = "Squig";
    
    orcmob.Troll.order =6;//6
    orcmob.Troll.wtype = 0;	//weapons select uses
    orcmob.Troll.rating = 20;  	//inc/dec uses
    orcmob.Troll.cost = 200;	//inc/dec uses
    orcmob.Troll.max = 1;	//inc uses
    orcmob.Troll.maxGroups = 1;	//inc uses
    orcmob.Troll.race = "Trollish";
    orcmob.Troll.name = "Troll";
    
    //Weapon Lists
    orcmob.weaponlist = {};
    orcmob.weaponlist.name = [];
    orcmob.weaponlist.cost = [];
    //Squig/Troll Weapon List
    orcmob.weaponlist.name[0] = ["Can't use weapons - 0g","Can't use weapons - 0g"];
    orcmob.weaponlist.cost[0] = [0, 0];
    //Goblin Weapon List
    orcmob.weaponlist.name[1] = ["1st dagger free - 0g","Two daggers - 2g","Club + dagger - 3g","Short Bow + 2 dagger - 7g","Short Bow,Club,dagger - 8g"];
    orcmob.weaponlist.cost[1] = [0,2,3,7,8];
    //Orc / Boss / Shaman / Big'Un Weapon List
    orcmob.weaponlist.name[2] = ["1st dagger free - 0g", "Two daggers - 2g", "Axe + dagger - 5g", "Sword + dagger - 10g","Bow + 2 daggers - 12g","Bow + Axe + dagger -15g","Crossbow + 2 dagger -27g"];
    orcmob.weaponlist.cost[2] = [0, 2, 5, 10, 12, 15, 27];
    
    
    orcmob.bornHero = function(type){
        switch(type){
            case "Shaman":
            case "BigUn":
            case "Boss":
                return true;
        }
        return false;
    }
    
    orcmob.isOneOfUs = function(type){
        switch(type){
            case "Shaman":
            case "BigUn"://careful not "Big'Un"
            case "Boss":
            case "Orc":
            case "Goblin":
            case "Troll":
            case "Squig":
                return true;
        }
        return false;
    }
    
    /*
     *ToDo: add function that seperates out who gains XP, on what chart, and who doesn't and what happense on promotion
     */
    
    /*
     *ToDo: add property for XP and property for base rating (5,20), then add method that adds the 2 and returns them.
     */
    
    /*
     *ToDo: Add HiredSwords here (Warlock, Pitfighter, Ogre_BodyGuard), still confused what Persona they can have Johann the Knife and Twilight Blade Elf guy...
     */
    