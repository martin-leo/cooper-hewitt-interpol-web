var ci_tools =(function(){
  /* Helpers
  Void -> Object */
  var tools = {};
  tools.clean_name = function(name) {
    /* return a lowercase string with whitespace replaced by -
    String -> String */
    return name.replace(/ /g,'-').toLowerCase();
  };
  return tools;
})();

/*

3 éléments :

- les valeurs select
- les classes
- les data-attribute du body

- les valeurs select prennent le pas sur le reste à tout moment

La fonction principale :
  - regarde l'état des sélecteur
  - regarde l'état des data-attributes

  si pas pareil :
  - change les classes et data attributes

*/

(function(){
  /* Anonymous function managing the CSS classes in the DOM
  Void -> Void */

  /* Variables */
  // select elements representation
  var selects = {};
  selects.version = undefined;
  selects.style = undefined;
  selects.weight = undefined;
  // data- attributes used to store data representation
  var datas = {};
  datas.version = undefined;
  datas.style = undefined;
  datas.weight = undefined;
  // elements
  var elements = {};
  // list of elements to update with classes
  elements.updatables = [];
  // links to useful parts of the DOM
  elements.body = document.getElementById("body");
  elements.version_select = document.getElementById('selector-police');
  elements.style_select = document.getElementById('selector-style');
  elements.weight_select = document.getElementById('selector-weight');

  function list_elements(){
    /* Save a list of all the elements with classes to update
    Void -> Void */

    // The elements are identified in the DOM with the js-modifiable class
    var html_collection = document.getElementsByClassName('js-modifiable');

    // Looping through the live HTMLcollection to store
    // the references to the elements in a constant
    for (var i = 0; i < html_collection.length; i++) {
      elements.updatables.push(html_collection[i]);
    }
  }

  function update_selects_representations () {
    /* update the selects representations
    Void -> Void */
    selects.version = ci_tools.clean_name(elements.version_select[elements.version_select.selectedIndex].value);
    selects.style = ci_tools.clean_name(elements.style_select[elements.style_select.selectedIndex].value);
    selects.weight = ci_tools.clean_name(elements.weight_select[elements.weight_select.selectedIndex].value);
  }

  function update_datas_representations () {
    /* update the data- attributes representation
    Void -> Void */
    datas.version = body.getAttribute('data-version');
    datas.style = body.getAttribute('data-style');
    datas.weight = body.getAttribute('data-weight');
  }

  function update_classes() {
    /* update classes wherever it had changed
    Void -> Void */
    if (selects.version !== datas.version) {
      update_class('version');
    }
    if (selects.style !== datas.style) {
      update_class('style');
    }
    if (selects.weight !== datas.weight) {
      update_class('weight');
    }
  }

  function update_class(type){
    /* add the new classes and remove the old one
    String -> Void */
    var attribute_selector = 'data-'+type;
    // updating the data- attribute
    elements.body.setAttribute(attribute_selector, selects[type]);

    // looping through all the updatable elements to add the new classes
    for (var i = 0; i < elements.updatables.length; i++) {
      elements.updatables[i].classList.add(selects[type]);
    }
    // looping through all the updatable elements to remove the old classes
    for (var j = 0; j < elements.updatables.length; j++) {
      elements.updatables[j].classList.remove(datas[type]);
    }
    // updating the data- attributes representation
    datas[type] = body.getAttribute('data-'+type);
  }

  function update(){
    /* Update the DOM to represent the select elements state */

    // check select elements state
    update_selects_representations();

    // check the data attributes
    update_datas_representations();

    // compare representation and update DOM accordingly
    update_classes();
  }

  function set_event_listeners(){
    /* Set the events listeners on the select elements */
    var selectors = document.getElementsByTagName('select');

    /* loop through the element to add the event listeners */
    for (var i = 0; i < selectors.length; i++) {
      selectors[i].addEventListener("change", update , false);
      selectors[i].addEventListener("blur", update , false); //iOS
    }
  }

  function init() {
    /* initialising the program
    Void -> Void */

    // updating accordingly to the select elements
    update_datas_representations();
    list_elements();
    update();
    // set up event listeners
    set_event_listeners();
  }

  // go !
  init();
})();
