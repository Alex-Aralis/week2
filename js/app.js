$(document).foundation()

var MutantCorp = function(url){
    if (!/^.*\/$/.test(url)) url += '/';

    this.url = url;
    this.mutants = [];
};

MutantCorp.prototype = {
    requestMutants: function(){
        return $.ajax({
            url:this.url,
            type: "GET",
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log('mutants not recieved');
            console.log(errorThrown);
        });
    },

    requestMutant: function(mutant){
        return $.ajax({
            url: this.url + ( mutant.id ? mutant.id : mutant ),
            type: "GET",
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log('mutant not recieved');
            console.log(errorThrown);
        });
    },

    proposeMutant: function(mutant){
        return $.ajax({
            url: this.url,
            type: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            contentType: "application/json",
            data: JSON.stringify({mutant:mutant,}),
        })
        .fail(
            function(jqXHR,textStatus, errorThrown){
            console.log('proposed mutant rejected: ' + errorThrown);
        });
    },

    protestMutant: function(mutant){
        return $.ajax({
            url: this.url + ( mutant.id ? mutant.id : mutant ),
            type: "DELETE",
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("mutant retained: " + errorThrown);
            console.log(errorThown);
        });
    },

    entreatMutant: function(mutant){
        var id = mutant.id;

        return jQuery.ajax({
            url: this.url + id,
            type: "PUT",
            headers: {"Content-Type": "application/json",},
            contentType: "application/json",
            data: JSON.stringify({"mutant": mutant}),
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
            A.ul = $('ul');

            A.form.on('submit', A.submitHandler);

            A.ul.on('click', 
                'span[contenteditable=false] ~ div .update-button', 
                A.updateButtonHandler);

            A.ul.on('click', 
                'span[contenteditable=true] ~ div .update-button', 
                A.updateSubmitHandler);

            A.ul.on('click', 
                '.delete-button',
                A.deleteButtonHandler);

            A.ul.on('keydown',
                'span[contenteditable=true]',
                A.updateSpanKeyHandler)

            A.MC.requestMutants().done(A.loadMutants);
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



            li.data('id', mutant.id);

            return li;
        }, 

        deleteButtonHandler: function(ev){
            var li = $(ev.currentTarget).closest('li');

            A.MC.protestMutant(li.data('id'))
                .done(function(){
                    li.remove();
                });
        },

        updateSubmitHandler: function(ev){
            var li = $(ev.currentTarget).closest('li');
            var span = li.find('span');
            var str = span.text();

            console.log(str);

            if(!str){
                return;
            }

            var mutant = {
                mutant_name: str,
                id: li.data('id'),
            };

            A.MC.entreatMutant(mutant)
                .done(function(mutant){
                    span.attr('contenteditable', 'false');
                    A.setli(li, mutant);
                });
        },
        
        updateSpanKeyHandler: function(ev){
            if(ev.keyCode === 13){
                ev.preventDefault();
            
                A.updateSubmitHandler(ev);

            }else if(ev.keyCode === 27){
                ev.preventDefault();

                var li = $(ev.currentTarget).closest('li');
                var span = $(ev.currentTarget);
                var str = span.text();

                span.attr('contenteditable', 'false');
                
                A.MC.requestMutant(li.data('id'))
                    .done(function(mutant){
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

            console.log(span);

            span.focus()
            A.selectElementContents(span.get(0));
        },

        submitHandler: function(ev){
            ev.preventDefault();
            var str = ev.currentTarget.field.value;

            if(!str){
                return;
            }

            var mutant = {
                mutant_name: str,
                power: str,
                real_name: str,
                power: str,
            }

            A.MC.proposeMutant(mutant)
                .done(function(mutant){
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
