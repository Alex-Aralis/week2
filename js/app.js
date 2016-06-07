$(document).foundation()

MutantCorp = function(url){
    if (!/^.*\/$/.test(url)) url += '/';

    this.url = url;
    this.mutants = [];
};

MutantCorp.prototype = {
    requestMutants: function(){
        $.ajax({
            url:this.url,
            type: "GET",
        })
        .done(function(data){
            this.mutants = data;
            console.log('mutants recieved');
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log('mutants not recieved');
            console.log(errorThrown);
        });
    },

    requestMutant: function(mutant){
        $.ajax({
            url: this.url + ( mutant.id ? mutant.id : mutant ),
            type: "GET",
        })
        .done(function(data){
            this.mutant = data;
            console.log('mutant recieved');
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log('mutant not recieved');
            console.log(errorThrown);
        });
    },

    proposeMutant: function(mutant){
        $.ajax({
            url: this.url,
            type: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            contentType: "application/json",
            data: JSON.stringify({mutant:mutant,}),
        }).done(function(data,textStatus, jqXHR){
            console.log('proposed mutant accepted: ' + jqXHR.status);
            console.log(data);
        }).fail(function(jqXHR,textStatus, errorThrown){
            console.log('proposed mutant rejected: ' + errorThrown);
        });
    },

    protestMutant: function(mutant){
        $.ajax({
            url: this.url + ( mutant.id ? mutant.id : mutant ),
            type: "DELETE",
        })
        .done(function(data){
            console.log("mutant expelled");
            console.log(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("mutant retained: " + errorThrown);
            console.log(errorThown);
        });
    },

    entreatMutant: function(mutant){
        var id = mutant.id;

        jQuery.ajax({
            url: this.url + id,
            type: "PUT",
            headers: {"Content-Type": "application/json",},
            contentType: "application/json",
            data: JSON.stringify({"mutant": mutant}),
        })
        .done(function(data, textStatus, jqXHR) {
            console.log("mutant influenced: " + jqXHR.status);
            console.log(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("mutant defiant");
            console.log(errorThrown);
        });
    },
};

m = new MutantCorp('https://mutant-school.herokuapp.com/api/v1/mutants');
  
