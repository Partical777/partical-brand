import { Component } from '@angular/core';

@Component({
  selector: 'expanding-card',
  templateUrl: './expanding-card.component.html',
  styleUrls: [ './expanding-card.component.css' ]
})
export class ExpandingCardComponent  {
  // listing vars here so they're in the global scope
  pageIsOpen = false;
  cards; nCards; cover; openContent; openContentText; openContentImage; closeContent; windowWidth; windowHeight; currentCard;

  paragraphText = '<p>Somebody once told me the world is gonna roll me. I ain\'t the sharpest tool in the shed. She was looking kind of dumb with her finger and her thumb in the shape of an "L" on her forehead. Well the years start coming and they don\'t stop coming. Fed to the rules and I hit the ground running. Didn\'t make sense not to live for fun. Your brain gets smart but your head gets dumb. So much to do, so much to see. So what\'s wrong with taking the back streets? You\'ll never know if you don\'t go. You\'ll never shine if you don\'t glow.</p><p>Hey now, you\'re an all-star, get your game on, go play. Hey now, you\'re a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars break the mold.</p><p>It\'s a cool place and they say it gets colder. You\'re bundled up now, wait till you get older. But the meteor men beg to differ. Judging by the hole in the satellite picture. The ice we skate is getting pretty thin. The water\'s getting warm so you might as well swim. My world\'s on fire, how about yours? That\'s the way I like it and I never get bored.</p>';



  ngOnInit() {
    this.resize();
    this.selectElements();
    this.attachListeners();
  }


  // select all the elements in the DOM that are going to be used
  selectElements() {
    this.cards = document.getElementsByClassName('card'),
    this.nCards = this.cards.length,
    this.cover = document.getElementById('cover'),
    this.openContent = document.getElementById('open-content'),
    this.openContentText = document.getElementById('open-content-text'),
    this.openContentImage = document.getElementById('open-content-image')
    this.closeContent = document.getElementById('close-content');
  }

  /* Attaching three event listeners here:
    - a click event listener for each card
    - a click event listener to the close button
    - a resize event listener on the window
  */
  attachListeners() {
    for (var i = 0; i < this.nCards; i++) {
      this.attachListenerToCard(i);
    }
    this.closeContent.addEventListener('click', this.onCloseClick);
    window.addEventListener('resize', this.resize);
  }

  attachListenerToCard(i) {
    this.cards[i].addEventListener('click', function(e) {
      var card = this.getCardElement(e.target);
      this.onCardClick(card, i);
    })
  }

  /* When a card is clicked */
  onCardClick(card, i) {
    // set the current card
    this.currentCard = card;
    // add the 'clicked' class to the card, so it animates out
    this.currentCard.className += ' clicked';
    // animate the card 'cover' after a 500ms delay
    setTimeout(function() {this.animateCoverUp(this.currentCard)}, 500);
    // animate out the other cards
    this.animateOtherCards(this.currentCard, true);
    // add the open class to the page content
    this.openContent.className += ' open';
  }

  /*
  * This effect is created by taking a separate 'cover' div, placing
  * it in the same position as the clicked card, and animating it to
  * become the background of the opened 'page'.
  * It looks like the card itself is animating in to the background,
  * but doing it this way is more performant (because the cover div is
  * absolutely positioned and has no children), and there's just less
  * having to deal with z-index and other elements in the card
  */
  animateCoverUp(card) {
    // get the position of the clicked card
    var cardPosition = card.getBoundingClientRect();
    // get the style of the clicked card
    var cardStyle = getComputedStyle(card);
    this.setCoverPosition(cardPosition);
    this.setCoverColor(cardStyle);
    this.scaleCoverToFillWindow(cardPosition);
    // update the content of the opened page
    this.openContentText.innerHTML = '<h1>'+card.children[2].textContent+'</h1>'+this.paragraphText;
    this.openContentImage.src = card.children[1].src;
    setTimeout(function() {
      // update the scroll position to 0 (so it is at the top of the 'opened' page)
      window.scroll(0, 0);
      // set page to open
      this.pageIsOpen = true;
    }, 300);
  }

  animateCoverBack(card) {
    var cardPosition = card.getBoundingClientRect();
    // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
    this.setCoverPosition(cardPosition);
    this.scaleCoverToFillWindow(cardPosition);
    // animate scale back to the card size and position
    this.cover.style.transform = 'scaleX('+1+') scaleY('+1+') translate3d('+(0)+'px, '+(0)+'px, 0px)';
    setTimeout(function() {
      // set content back to empty
      this.openContentText.innerHTML = '';
      this.openContentImage.src = '';
      // style the cover to 0x0 so it is hidden
      this.cover.style.width = '0px';
      this.cover.style.height = '0px';
      this.pageIsOpen = false;
      // remove the clicked class so the card animates back in
      this.currentCard.className = this.currentCard.className.replace(' clicked', '');
    }, 301);
  }

  setCoverPosition(cardPosition) {
    // style the cover so it is in exactly the same position as the card
    this.cover.style.left = cardPosition.left + 'px';
    this.cover.style.top = cardPosition.top + 'px';
    this.cover.style.width = cardPosition.width + 'px';
    this.cover.style.height = cardPosition.height + 'px';
  }

  setCoverColor(cardStyle) {
    // style the cover to be the same color as the card
    this.cover.style.backgroundColor = cardStyle.backgroundColor;
  }

  scaleCoverToFillWindow(cardPosition) {
    // calculate the scale and position for the card to fill the page,
    var scaleX = this.windowWidth / cardPosition.width;
    var scaleY = this.windowHeight / cardPosition.height;
    var offsetX = (this.windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
    var offsetY = (this.windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
    // set the transform on the cover - it will animate because of the transition set on it in the CSS
    this.cover.style.transform = 'scaleX('+scaleX+') scaleY('+scaleY+') translate3d('+(offsetX)+'px, '+(offsetY)+'px, 0px)';
  }

  /* When the close is clicked */
  onCloseClick() {
    // remove the open class so the page content animates out
    this.openContent.className = this.openContent.className.replace(' open', '');
    // animate the cover back to the original position card and size
    this.animateCoverBack(this.currentCard);
    // animate in other cards
    this.animateOtherCards(this.currentCard, false);
  }

  animateOtherCards(card, out) {
    var delay = 100;
    for (var i = 0; i < this.nCards; i++) {
      // animate cards on a stagger, 1 each 100ms
      if (this.cards[i] === card) continue;
      if (out) this.animateOutCard(this.cards[i], delay);
      else this.animateInCard(this.cards[i], delay);
      delay += 100;
    }
  }

  // animations on individual cards (by adding/removing card names)
  animateOutCard(card, delay) {
    setTimeout(function() {
      card.className += ' out';
    }, delay);
  }

  animateInCard(card, delay) {
    setTimeout(function() {
      card.className = card.className.replace(' out', '');
    }, delay);
  }

  // this function searches up the DOM tree until it reaches the card element that has been clicked
  getCardElement(el) {
    if (el.className.indexOf('card ') > -1) return el;
    else return this.getCardElement(el.parentElement);
  }

  // resize function - records the window width and height
  resize() {
    if (this.pageIsOpen) {
      // update position of cover
      var cardPosition = this.currentCard.getBoundingClientRect();
      this.setCoverPosition(cardPosition);
      this.scaleCoverToFillWindow(cardPosition);
    }
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

}
