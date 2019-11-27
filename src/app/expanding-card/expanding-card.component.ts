import { Component } from '@angular/core';

@Component({
  selector: 'expanding-card',
  templateUrl: './expanding-card.component.html',
  styleUrls: [ './expanding-card.component.css' ]
})
export class ExpandingCardComponent  {
  pageIsOpen = false;
  cards; nCards; cover; openContent; openContentText; openContentImage; closeContent; windowWidth; windowHeight; currentCard;

  paragraphText = '<p>Somebody once told me the world is gonna roll me. I ain\'t the sharpest tool in the shed. She was looking kind of dumb with her finger and her thumb in the shape of an "L" on her forehead. Well the years start coming and they don\'t stop coming. Fed to the rules and I hit the ground running. Didn\'t make sense not to live for fun. Your brain gets smart but your head gets dumb. So much to do, so much to see. So what\'s wrong with taking the back streets? You\'ll never know if you don\'t go. You\'ll never shine if you don\'t glow.</p><p>Hey now, you\'re an all-star, get your game on, go play. Hey now, you\'re a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars break the mold.</p><p>It\'s a cool place and they say it gets colder. You\'re bundled up now, wait till you get older. But the meteor men beg to differ. Judging by the hole in the satellite picture. The ice we skate is getting pretty thin. The water\'s getting warm so you might as well swim. My world\'s on fire, how about yours? That\'s the way I like it and I never get bored.</p>';



  ngOnInit() {
    this.resize();
    this.selectElements();
    this.attachListeners();
  }

  selectElements() {
    this.cards = document.getElementsByClassName('card'),
    this.nCards = this.cards.length,
    this.cover = document.getElementById('cover'),
    this.openContent = document.getElementById('open-content'),
    this.openContentText = document.getElementById('open-content-text'),
    this.openContentImage = document.getElementById('open-content-image')
    this.closeContent = document.getElementById('close-content');
  }

  attachListeners() {
    window.addEventListener('resize', this.resize);
  }

  cardClicked(e) {
    let card = this.getCardElement(e.target);
    this.onCardClick(card);
  }

  onCardClick(card) {
    this.currentCard = card;
    this.currentCard.className += ' clicked';
    this.animateCoverUp(this.currentCard);
    this.animateOtherCards(this.currentCard, true);
    this.openContent.className += ' open';
  }

  animateCoverUp(card) {
    var cardPosition = card.getBoundingClientRect();
    var cardStyle = getComputedStyle(card);
    this.setCoverPosition(cardPosition);
    this.setCoverColor(cardStyle);
    this.scaleCoverToFillWindow(cardPosition);
    this.openContentText.innerHTML = '<h1>'+card.children[2].textContent+'</h1>'+this.paragraphText;
    this.openContentImage.src = card.children[1].src;
    window.scroll(0, 0);
    this.pageIsOpen = true;
  }

  animateCoverBack(card) {
    var cardPosition = card.getBoundingClientRect();
    this.setCoverPosition(cardPosition);
    this.scaleCoverToFillWindow(cardPosition);
    this.cover.style.transform = 'scaleX('+1+') scaleY('+1+') translate3d('+(0)+'px, '+(0)+'px, 0px)';
    this.openContentText.innerHTML = '';
    this.openContentImage.src = '';
    this.cover.style.width = '0px';
    this.cover.style.height = '0px';
    this.pageIsOpen = false;
    this.currentCard.className = this.currentCard.className.replace(' clicked', '');
  }

  setCoverPosition(cardPosition) {
    this.cover.style.left = cardPosition.left + 'px';
    this.cover.style.top = cardPosition.top + 'px';
    this.cover.style.width = cardPosition.width + 'px';
    this.cover.style.height = cardPosition.height + 'px';
  }

  setCoverColor(cardStyle) {
    this.cover.style.backgroundColor = cardStyle.backgroundColor;
  }

  scaleCoverToFillWindow(cardPosition) {
    var scaleX = this.windowWidth / cardPosition.width;
    var scaleY = this.windowHeight / cardPosition.height;
    var offsetX = (this.windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
    var offsetY = (this.windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
    this.cover.style.transform = 'scaleX('+scaleX+') scaleY('+scaleY+') translate3d('+(offsetX)+'px, '+(offsetY)+'px, 0px)';
  }

  onCloseClick() {
    this.openContent.className = this.openContent.className.replace(' open', '');
    this.animateCoverBack(this.currentCard);
    this.animateOtherCards(this.currentCard, false);
  }

  animateOtherCards(card, out) {
    var delay = 100;
    for (var i = 0; i < this.nCards; i++) {
      if (this.cards[i] === card) continue;
      if (out) this.animateOutCard(this.cards[i], delay);
      else this.animateInCard(this.cards[i], delay);
      delay += 100;
    }
  }

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

  getCardElement(el) {
    if (el.className.indexOf('card ') > -1) return el;
    else return this.getCardElement(el.parentElement);
  }

  resize() {
    if (this.pageIsOpen) {
      var cardPosition = this.currentCard.getBoundingClientRect();
      this.setCoverPosition(cardPosition);
      this.scaleCoverToFillWindow(cardPosition);
    }
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

}
