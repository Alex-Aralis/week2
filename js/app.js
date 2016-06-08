$(document).foundation()

var MutantCorp = function(url){
    if (!/^.*\/$/.test(url)) url += '/';

    this.url = url;
    this.mutants = [];
};

MutantCorp.prototype = {
    requestMutants: function(func){
        return $.ajax({
            url:this.url,
            type: "GET",
        })
        .done(func)
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log('mutants not recieved');
            console.log(errorThrown);
        });
    },

    requestMutant: function(mutant, func){
        return $.ajax({
            url: this.url + ( mutant.id ? mutant.id : mutant ),
            type: "GET",
        })
        .done(func)
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log('mutant not recieved');
            console.log(errorThrown);
        });
    },

    proposeMutant: function(mutant, func){
        return $.ajax({
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

    protestMutant: function(mutant, func){
        return $.ajax({
            url: this.url + ( mutant.id ? mutant.id : mutant ),
            type: "DELETE",
        })
        .done(func)
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("mutant retained: " + errorThrown);
            console.log(errorThown);
        });
    },

    entreatMutant: function(mutant, func){
        var id = mutant.id;

        return jQuery.ajax({
            url: this.url + id,
            type: "PUT",
            headers: {"Content-Type": "application/json",},
            contentType: "application/json",
            data: JSON.stringify({"mutant": mutant}),
        })
        .done(func)
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
                var li = A.createli(mutant);

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

        createli(mutant){
            var li = A.cloneli();

            A.setli(li, mutant);            

            return li;
        },

        setli(li, mutant){
            li.find('span').text(mutant.mutant_name + ' (' + mutant.real_name + ') ' + mutant.power);

            li.find('.delete-button')
                .on('click', A.deleteButtonHandler);

            li.find('.update-button')
                .on('click', A.updateButtonHandler);

            li.data('id', mutant.id);

            return li;
        }, 

        deleteButtonHandler: function(ev){
            var li = $(ev.currentTarget).closest('li');

            A.MC.protestMutant(li.data('id'), function(){
                li.remove();
            });

        },
        
        updateSpanKeyupHandler: function(ev){
            if(ev.keyCode === 13){
                ev.preventDefault();

                var li = $(ev.currentTarget).closest('li');
                var span = $(ev.currentTarget);
                var str = span.text();

                var mutant = {
                    mutant_name: str,
                    id: li.data('id'),
                };

                A.MC.entreatMutant(mutant, function(mutant){
                    span.attr('contenteditable', 'false');
                    A.setli(li, mutant);
                });
            }else if(ev.keyCode === 27){
                ev.preventDefault();

                var li = $(ev.currentTarget).closest('li');
                var span = $(ev.currentTarget);
                var str = span.text();

                span.attr('contenteditable', 'false');
                
                A.MC.requestMutant(li.data('id'), function(mutant){
                    A.setli(li, mutant);
                });
            }
        },
        
        selectElementContents: function(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        },

        updateButtonHandler: function(ev){
            var li = $(ev.currentTarget).closest('li');
            var span = li.find('span');

            span.attr('contenteditable', 'true');

            span.on('keyup', A.updateSpanKeyupHandler);
            span.on('keydown', A.updateSpanKeyupHandler);

            span.focus()
            A.selectElementContents(span.get(0));
        },

        submitHandler: function(ev){
            ev.preventDefault();

            var str = ev.currentTarget.field.value;

            var mutant = {
                mutant_name: str,
                power: str,
                real_name: str,
                power: str,
            }

            A.MC.proposeMutant(mutant, function(mutant){
                A.prependli(A.createli(mutant));
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
