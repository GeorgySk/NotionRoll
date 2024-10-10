console.log('NotionRoll script is loaded');

window.addEventListener('load', function () {
  console.log('Page has finished loading');
  const observer = new MutationObserver(function (mutations: MutationRecord[]) {
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


function checkForTablesRecursive(nodes: NodeList): boolean {
  let tablesAdded = false;
  nodes.forEach(function (node) {
    console.log('Node is: ', node);
    if (node.nodeType === 1) {
      const element = node as HTMLElement;
      if (element.classList.contains('notion-table-view')) {
        console.log('...this node is a table');
        tablesAdded = true;
      } else if (element.childNodes.length > 0) {
        tablesAdded = checkForTablesRecursive(element.childNodes) || tablesAdded;
      }
    }
  });
  return tablesAdded;
}


function handleAddedTables(): void {
    const tables = document.getElementsByClassName('notion-table-view');
    console.log('Tables: ', tables.length);
    if (tables.length > 0) {
        for (let i = 0; i < tables.length; i++) {
            const table = tables[i] as HTMLElement;
            const controlsRow = getControlsRow(table);
            if (!controlsRow.querySelector('.notion-random-line-button')) {
                console.log('Adding button for table with ID:', table.getAttribute('data-block-id'));
                const button = createButton(table);
                controlsRow.appendChild(button);
            }
        }
    }
}

function getControlsRow(table: HTMLElement): HTMLElement {
    const container = table.closest('div[contenteditable]')!.parentNode as HTMLElement;
    for (let i = 0; i < container.children.length; i++) {
        const element = container.children[i] as HTMLElement;
        if (element && element.contentEditable !== undefined && element.contentEditable === 'false') {
            return element.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
        }
    }
    throw new Error('Controls row not found');
}


function createButton(table: HTMLElement): HTMLButtonElement {
    const button = document.createElement('button');
    button.innerHTML = 'Random Line';
    button.classList.add('notion-random-line-button');
    const newRowButton = document.querySelector('.notion-collection-view-item-add')!.firstElementChild as HTMLElement;
    copyStyles(newRowButton, button);
    button.style.backgroundColor = 'green';

    button.addEventListener('click', function(event) {
        buttonClickHandler(event, table);
    });
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return button;
}


function copyStyles(source: HTMLElement, target: HTMLElement): void {
    const sourceStyle = window.getComputedStyle(source);
    const propertiesToCopy = ['fontFamily',
                                    'fontSize',
                                    'padding',
                                    'margin',
                                    'lineHeight',
                                    'height',
                                    'backgroundColor',
                                    'border'];
    propertiesToCopy.forEach(function(property) {
        target.style[property as any] = sourceStyle.getPropertyValue(property);
    });
    target.style.borderRadius = sourceStyle.borderTopLeftRadius;
}


function buttonClickHandler(event: Event, table: HTMLElement): void {
    console.log('Button clicked');
    const rows = getRows(table);
    console.log(rows);
    console.log('Found rows:', rows.length);
    const row_idx = Math.floor(Math.random() * rows.length);
    console.log('Row index generated:', row_idx);
    const row = rows[row_idx];
    console.log(row);
    const checkbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.click();
}


function getRows(table: HTMLElement): NodeListOf<HTMLElement> {
    return table.childNodes[0].childNodes[2].querySelectorAll('.notion-selectable.notion-page-block.notion-collection-item');
}


function handleMouseEnter(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = '#006000';
}


function handleMouseLeave(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'green';
}
