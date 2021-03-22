{ /// Styles
  document.head.insertAdjacentHTML('beforeend',
    `<style type="text/css">
      #toc {
        position: fixed;
        right: 20px;
        text-align: right;
        line-height: 2em;
      }
      #toc img {
        height: 2em;
        vertical-align: middle;
        margin-bottom: 10px;
      }
      span.color { font-weight: bold; }
      .red    { color: red; }
      .yellow { color: #dd0; }
      .blue   { color: blue; }
      .white  { color: lightgray; }
      .green  { color: green; }
    </style>`
  );
}

{ /// Pinned table of contents
  document.getElementById('ManualContent').insertAdjacentHTML('afterbegin',
    `<div id="toc">
      <h2> <a href="#Wires">           Simple Wires    <img src="img/module-icons/WireComponent.svg"        > </a> </h2>
      <h2> <a href="#TheButton">       Button          <img src="img/module-icons/ButtonComponent.svg"      > </a> </h2>
      <h2> <a href="#Keypads">         Symbols         <img src="img/module-icons/KeypadComponent.svg"      > </a> </h2>
      <h2> <a href="#SimonSays">       Simon Says      <img src="img/module-icons/SimonComponent.svg"       > </a> </h2>
      <h2> <a href="#WhosOnFirst">     Confusing Words <img src="img/module-icons/WhosOnFirstComponent.svg" > </a> </h2>
      <h2> <a href="#Memory">          Memory          <img src="img/module-icons/MemoryComponent.svg"      > </a> </h2>
      <h2> <a href="#MorseCode">       Morse           <img src="img/module-icons/MorseCodeComponent.svg"   > </a> </h2>
      <h2> <a href="#ComplicatedWires">Complex Wires   <img src="img/module-icons/VennWireComponent.svg"    > </a> </h2>
      <h2> <a href="#WireSequences">   Wire Sequence   <img src="img/module-icons/WireSequenceComponent.svg"> </a> </h2>
      <h2> <a href="#Mazes">           Maze            <img src="img/module-icons/MazeComponent.svg"        > </a> </h2>
      <h2> <a href="#Passwords">       Password        <img src="img/module-icons/PasswordComponent.svg"    > </a> </h2>
      <h2> <a href="#Knobs">           Knobs           <img src="img/module-icons/NeedyKnobComponent.svg"   > </a> </h2>
    </div>`
  );
}

{ /// Colored color words
  // https://stackoverflow.com/a/29301739/1171227
  for (const color of ['red', 'yellow', 'blue', 'black', 'white', 'green']) {
    matchText(document.body, new RegExp(`\\b${color}\\b`, "gi"), function(node, match, offset) {
      var span = document.createElement("span");
      span.className = `color ${color}`;
      span.textContent = match;
      return span;
    });
  }

  function matchText(node, regex, callback, excludeElements) {

    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas', 'svg']);
    var child = node.firstChild;

    while (child) {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
            var bk = 0;
            child.data.replace(regex, function(all) {
                var args = [].slice.call(arguments),
                    offset = args[args.length - 2],
                    newTextNode = child.splitText(offset+bk), tag;
                bk -= child.data.length + all.length;

                newTextNode.data = newTextNode.data.substr(all.length);
                tag = callback.apply(window, [child].concat(args));
                child.parentNode.insertBefore(tag, newTextNode);
                child = newTextNode;
            });
            regex.lastIndex = 0;
            break;
        }

        child = child.nextSibling;
    }

    return node;
  };
  document.querySelector('.whos-on-first-look-at-display .red').className = '';
}

{ /// Complex wires: Colored ellipses
  $('svg ellipse')[0].style.stroke = 'red';
  $('svg ellipse')[1].style.stroke = 'blue';
  $('svg ellipse')[3].style.stroke = 'yellow';
}

{ /// Confusing words / Who’s on First: Sort & trim
  // https://stackoverflow.com/a/14268260/1171227
  // https://ktane.fandom.com/wiki/Who%27s_on_First
  // Step 1
  const table1 = document.querySelector('.whos-on-first-step1-table');
  const blocks = Array.from(table1.querySelectorAll(':scope > tbody > tr > td > table'));
  sortAlphabetically(blocks);
  for (const [i, block] of blocks.entries()) {
    table1.rows[Math.trunc(i / 6)].cells[i % 6].appendChild(block);
  }

  // Step 2
  const table = document.querySelector('.whos-on-first-step2-table');
  const trs = Array.from(table.rows);
  sortAlphabetically(trs);
  for (const tr of trs) {
    table.appendChild(tr);
    const word = tr.querySelector('th span').textContent;
    const match = Array.from(tr.querySelectorAll('td span')).find(s => s.textContent === word);
    while (match.nextSibling)
      match.nextSibling.remove();
  }

  function sortAlphabetically(elems) {
    elems.sort(function (e1, e2) {
      return (e1.textContent > e2.textContent) ? 1 : -1;
    });
  }
}

{ /// Symbols: Name tooltips
  // https://www.reddit.com/r/ktane/comments/3oab5z/full_chart_of_symbols_and_their_names/
  document.querySelectorAll('.keypad-table img').forEach(img => {
    // https://bombmanual.com/web/img/modules/keypad/6-omega.png → omega
    img.title = img.src.match(/-([^.]+)/)[1];
  });
}

{ /// Morse Code: Sort words
  const table = document.querySelector('.morse-frequency-table');
  const trs = Array.from(table.rows).slice(1);
  sortAlphabetically(trs);
  for (const tr of trs) {
    table.appendChild(tr);
  }
}
