$(document).foundation()

var MutantCorp = function(url){
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


var m = new MutantCorp('https://mutant-school.herokuapp.com/api/v1/mutants');

var App = function(){
    A = {
        init: function(MC){
            A.MC = MC;

            A.form = $('form');
            A.submitButton = $('form button');
            A.field = $('form input');

            A.form.on('submit', A.submitHandler);
        },

        cloneli: function(){
            //var li = document.querySelector('#li_template');
            var li = $('li').clone();
             
            //li.removeAttribute('id');
            li.removeAttr('id');

            return li;
        }, 
    
        prependli(li){
            //return document.querySelector('ul').appendChild(li);
            return $('ul').prepend(li);
        }, 

        createli(str){
            var li = A.cloneli();

            li.find('span').text(str);

/*
            li.innerText = str;

            li.querySelector('.delete-button')  
                .onclick = A.deleteButtonHandler;
            li.querySelector('.update-button')
                .onclick = A.updateButtonHandler;
*/

            li.find('.delete-button')
                .on('click', A.deleteButtonHandler);

            li.find('.update-button')
                .on('click', A.updateButtonHandler);

/*
            document.querySelector('ul')
                .appendChild(
                    document
                    .querySelector('#li_template')
                    .cloneNode(true)
                );
*/

            return li;
        },

        deleteButtonHandler: function(ev){},
        updateButtonHandler: function(ev){},

        submitHandler: function(ev){
            ev.preventDefault();

            A.prependli(A.createli(ev.currentTarget.field.value));

            A.clearSubmitField();
        },

        clearSubmitField(){
            A.field.val('');
        },
    };

    return A;
}()  

App.init(m);
