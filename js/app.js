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
            url: this.url + mutant,
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
            type: "POSE",
            headers:{
                "Content-Type":"application/json",
            },
            contentType: "application/json",
            data: JSON.stringify({mutant:props,}),
        }).done(function(data,textStatus, jqXHR){
            console.log('proposed mutant accepted: ' + jqXHR.status);
            console.log(data);
        }).fail(function(data,textStatus, jqXHR){
            console.log('proposed mutant rejected: ' + jqXHR.status);
        });
    },
};

m = new MutantCorp('https://mutant-school.herokuapp.com/api/v1/mutants');
  
