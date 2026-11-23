// All brands, event programmes, speakers, packages, fees and project examples
// are fictional demonstrations. These are not available to purchase.
const offer=(id,title,category,price,imageKey,description,features)=>({id,title,category,price,imageKey,description,features})
export const eventOffers={
 editorial:[
  offer('summit-day','The Conference Day','Conference',15000,'panel','One full day of keynotes, talks and informal introductions.',['Main-stage sessions','Community space','Digital programme']),
  offer('full-access','The Full Experience','Conference',25000,'keynote','Two days of conversations, inspiration and opportunities to meet your next collaborator.',['Both conference days','Talks and panels','Community activities']),
  offer('makers-lab','The Makers Lab','Workshops',35000,'workshop','A smaller hands-on creative session alongside the main conference programme.',['Main event admission','Workshop selection','Materials and guided exercises']),
  offer('studio-meetup','Studio Roundtable','Community',12000,'creators','A focused room for creatives and founders to exchange ideas.',['Guided introductions','Peer discussion','Take-home insights']),
  offer('brand-showcase','Creative Showcase','Exhibition',20000,'session','A platform to present interesting new work and ideas to the community.',['Presentation slot','Showcase gallery','Event access']),
  offer('partner-package','Community Partner','Partnership',300000,'crowd','A sample partner package for businesses hoping to support the programme.',['Brand placement','Partner lounge','Collaborative activation briefing'])
 ],
 catalogue:[
  offer('live-print','Live Screen Print','Live Printing',240000,'shirt','A hands-on event station where visitors create their own printed piece.',['Print station design','On-site creative direction','Event-day setup']),
  offer('pop-up','The Pop-up Shop','Experiences',210000,'apparel','A compact, designed merchandise experience with a clear guest journey.',['Pop-up concept','Display design','Experience coordination']),
  offer('capsule','Artist Capsule Merch','Merchandise',180000,'merch','A short-run collection designed around your event story.',['Creative direction','Graphic artwork','Merchandising guidance']),
  offer('custom-bar','The Customisation Bar','Experiences',155000,'fabric','An intimate station for personalising event items.',['Art direction','Guest journey','Personalisation concept']),
  offer('creative-day','The Content Lab','Production',95000,'camera','Campaign photography and behind-the-scenes coverage for the activation.',['Shot list','On-site capture','Edited selects']),
  offer('brand-install','Brand Experience Install','Experiences',275000,'creators','A complete look and feel for an immersive experiential activation.',['Environment concept','Visual identity treatment','Guest interaction plan'])
 ],
 minimal:[
  offer('motion-ident','Motion Identity','Motion',120000,'animation','A brand symbol or title brought to life with personality.',['Motion exploration','Typography animation','Export-ready assets']),
  offer('character-short','The Character Story','Animation',180000,'illustrator','A colourful 2D character-driven short with its own style.',['Character exploration','Storyboard','Animation production']),
  offer('social-motion','The Social Edit','Video',95000,'editing','Energetic short-form visual content designed for feeds and campaigns.',['Creative direction','Typography motion','Format delivery']),
  offer('event-visual','Live Screen Visuals','Events',160000,'festival','On-screen motion artwork for a high-energy creative event.',['Art direction','Display formats','Motion loops']),
  offer('brand-film','The Brand Film','Film',250000,'camera','An imaginative story-led film concept designed around your message.',['Script treatment','Visual plan','Edit direction']),
  offer('design-pack','The Playful Graphic Pack','Design',85000,'notebooks','A small suite of expressive visuals ready for a campaign.',['Illustration concepts','Static assets','Brand applications'])
 ],
 playful:[
  offer('good-day','A Good Day Pass','Tickets',12000,'friends','One day of creative discovery, conversation and open workshops.',['One-day sample access','Programme highlights','Community activity']),
  offer('wonder-weekend','The Wonder Weekend','Tickets',20000,'festival','Both days of talks, workshops and a little unexpected inspiration.',['Two-day sample access','Public workshop sessions','Community moments']),
  offer('maker-pass','The Maker Pass','Tickets',28000,'workshop','A weekend pass with an additional guided creative activity.',['Two-day sample access','Workshop request','Materials concept']),
  offer('story-lab','The Story Workshop','Workshops',16000,'notebooks','A workshop dedicated to memorable stories and playful storytelling.',['Creative brief','Group exercises','Showcase session']),
  offer('colour-lab','Design for Fun','Workshops',15000,'illustrator','A colourful exploration of design and imagination.',['Hands-on activity','Creative toolkit','Feedback discussion']),
  offer('team-pass','Come as a Team','Groups',90000,'creators','A group participation concept for small creative teams.',['Team passes','Group activity request','Community programme'])
 ]
}
