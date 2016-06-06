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

    proposeMutant: function(props){
        $.ajax({
            url: this.url,
            type: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            contentType: "application/json",
            data: JSON.stringify({mutant:props,}),
        }).done(function(data,textStatus, jqXHR){
            console.log('proposed mutant accepted: ' + jqXHR.status);
            console.log(data);
        }).fail(function(jqXHR,textStatus, errorThrown){
            console.log('proposed mutant rejected: ' + errorThrown);
        });
    },

    protestMutant: function(id){
        $.ajax({
            url: this.url + ( id.id ? id.id : id ),
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

    entreatMutant: function(id, term){
        jQuery.ajax({
            url: url + mutant.id,
            type: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            contentType: "application/json",
            data: JSON.stringify({"term": term,}),
        })
        .done(function(data, textStatus, jqXHR) {
            console.log("Mutant influanced: " + jqXHR.status);
            console.log(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("Mutant defied");
            console.log(errorThrown);
        })
    },
};

m = new MutantCorp('https://mutant-school.herokuapp.com/api/v1/mutants');
  
