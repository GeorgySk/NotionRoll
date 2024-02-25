console.log('Notion Roll script is loaded');

window.addEventListener('load', function () {
  console.log('Page has finished loading');
  var observer = new MutationObserver(function (mutations) {
    console.log('Mutation observer created');
    mutations.forEach(function (mutation) {
      console.log('Mutation detected:', mutation);
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        console.log('Mutation has added nodes. Iterating over them...');
        // check if tables have been added to the page
        const tablesAdded = checkForTablesRecursive(mutation.addedNodes);
        if (tablesAdded) {
          console.log('A table was found. Proceeding with adding a button...');
          handleAddedTables();
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});


function checkForTablesRecursive(nodes) {
  let tablesAdded = false;
  nodes.forEach(function (node) {
    console.log('Node is: ', node);
    if (node.nodeType === 1) {
      if (node.classList.contains('notion-table-view')) {
        console.log('...this node is a table');
        tablesAdded = true;
      } else if (node.childNodes.length > 0) {
        tablesAdded = checkForTablesRecursive(node.childNodes) || tablesAdded;
      }
    }
  });
  return tablesAdded;
}


function handleAddedTables() {
    var tables = document.getElementsByClassName('notion-table-view');
    console.log('Tables: ', tables.length);
    if (tables.length > 0) {
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            var controlsRow = getControlsRow(table);
            if (!controlsRow.querySelector('.notion-random-line-button')) {
                console.log('Adding button for table with ID:', table.getAttribute('data-block-id'));
                var button = createButton(table);
                controlsRow.appendChild(button);
            }
        }
    }
}

function getControlsRow(table) {
    var container = table.closest('div[contenteditable]').parentNode;
    for (var i = 0; i < container.children.length; i++) {
        var element = container.children[i];
        if (element && element.contentEditable !== undefined && element.contentEditable === 'false') {
            return element.childNodes[0].childNodes[0].childNodes[1];
        }
    }
}


function createButton(table) {
    var button = document.createElement('button');
    button.innerHTML = 'Random Line';
    button.classList.add('notion-random-line-button');

    var newRowButton = document.querySelector('.notion-collection-view-item-add').firstElementChild;
    copyStyles(newRowButton, button);
    button.style.backgroundColor = 'green';

    button.addEventListener('click', function(event) {
        buttonClickHandler(event, table);
    });
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return button;
}


function copyStyles(source, target) {
    var sourceStyle = window.getComputedStyle(source);
    var propertiesToCopy = ['fontFamily',
                                    'fontSize',
                                    'padding',
                                    'margin',
                                    'lineHeight',
                                    'height',
                                    'backgroundColor',
                                    'border'];
    propertiesToCopy.forEach(function(property) {
        target.style[property] = sourceStyle[property];
    });
    target.style.borderRadius = sourceStyle.borderTopLeftRadius;
}


function buttonClickHandler(event, table) {
    console.log('Button clicked');
    var rows = getRows(table);
    console.log(rows);
    console.log('Found rows:', rows.length);
    var row_idx = Math.floor(Math.random() * rows.length);
    console.log('Row index generated:', row_idx);
    var row = rows[row_idx];
    console.log(row);
    var checkbox = row.querySelector('input[type="checkbox"]');
    checkbox.click();
}


function getRows(table) {
    return table.childNodes[0].childNodes[2].querySelectorAll('.notion-selectable.notion-page-block.notion-collection-item');
}


function handleMouseEnter(event) {
    event.target.style.backgroundColor = '#006000';
}


function handleMouseLeave(event) {
    event.target.style.backgroundColor = 'green';
}
