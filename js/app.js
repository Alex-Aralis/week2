$(document).foundation()

var MutantCorp = function(url){
    if (!/^.*\/$/.test(url)) url += '/';

    this.url = url;
    this.mutants = [];
};

MutantCorp.prototype = {
    requestMutants: function(func){
        $.ajax({
            url:this.url,
            type: "GET",
        })
        .done(func)
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

    proposeMutant: function(mutant, func){
        $.ajax({
            url: this.url,
            type: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            contentType: "application/json",
            data: JSON.stringify({mutant:mutant,}),
        }).done(func).fail(
            function(jqXHR,textStatus, errorThrown){
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


var m = new MutantCorp('https://mutant-school.herokuapp.com/api/v1/mutants');

var App = function(){
    A = {
        init: function(MC){
            A.MC = MC;

            A.form = $('form');
            A.submitButton = $('form button');
            A.field = $('form input');

            A.form.on('submit', A.submitHandler);

            A.MC.requestMutants(A.loadMutants);
        },

        loadMutants: function(mutants){
            $.each(mutants, function(i, mutant){
                var li = A.createli(mutant.mutant_name);

                li.data('id', mutant.id);
                A.prependli(li);
            });
        
            return mutants;
        },

        cloneli: function(){
            var li = $('#li_template').clone();
             
            li.removeAttr('id');

            return li;
        }, 
    
        prependli(li){
            return $('ul').prepend(li);
        }, 

        createli(str){
            var li = A.cloneli();

            li.find('span').text(str);

            li.find('.delete-button')
                .on('click', A.deleteButtonHandler);

            li.find('.update-button')
                .on('click', A.updateButtonHandler);

            return li;
        },

        deleteButtonHandler: function(ev){
            var li = $(ev.currentTarget).closest('li');
            A.MC.protestMutant(li.data('id'));

            li.remove();
        },
        updateButtonHandler: function(ev){},

        submitHandler: function(ev){
            ev.preventDefault();

            var str = ev.currentTarget.field.value;

            var mutant = {
                mutant_name: str,
                power: str,
                real_name: str,
                power: str,
            }

            A.MC.proposeMutant(mutant, function(){
                A.prependli(A.createli(str));
            }); 

            A.clearSubmitField();
        },

        clearSubmitField(){
            A.field.val('');
        },
    };

    return A;
}()  

App.init(m);
