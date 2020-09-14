/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const mipmaps = [
  {
    "width": 160,
    "height": 39,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 80,
    "height": 20,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAUCAYAAAAa2LrXAAAAAklEQVR4AewaftIAAANhSURBVM3BT2gcZRzH4c/3fWc3awLdDSKKpnlNutIYiwUlxKZqKfQggghFvfRSAupJKTQ3tRTMIeBBEFTwUFER9CCIBxWi9aDBIoK0/ishxAxY0TTd7FSbJtud+YmKeLCHZnc2yfOILSSEUIqkXTK7PTOqQA9/EXUHMXB6Lo7PsIWITRRCKHXBeAoHe1Dfnah6h+SriAjhxd9Sg1WMOYxvzRpnLJttinMOPliDE3Ecr7JJxCbYEcIBD0dvQ/c8Kl/ZIUdVwnNtGsCcGWct4z1L6wvYTBOmforjL9hgYgMNhrDXweQDuPsOusjvkmhXCnxvGe9nafox2ecZPDsfxzNsELEBQgilCF4awx163EXdQxKdcNaMl7Pmytdkbzfh6TiOV+kw0WGDIdzdBW9OKBp+0Hk8nZUCH2YpL1hztgHj83E8Qwd5OqgawpEB9NqLrhj2OIej8xywU4598td/Y9nDrlJu1JLkFB3i6ZDhECZGcJNTrljuk9hovRL75bvnzfatVMqlWpJ8Rgd4OmA4hIndaOq4KxZ7xaa5TnC/fOGC2diFSrmrliQnyZknZ9UQjozgJo+7YrEiNl1BMCLvZs1GG5XyylKSfEmOPDkaDGHvAHp1yhW39YotoyAYlY9Ome3JKuXvlpNklpx4chJCKJXQp6+4ws03SWw1JcGIXNe0Zff2VMrv1pLkD3LgyEkBvXNMfqBfYqvqk3hO0XbB6+TEk4OhEI4elH/qkIvEFrddUgOqP5e3FWpJcpI2RbQphNBbQROHFYkcrQFrJhpAA2gCKZABGf/wgAAPREAEFIECUJRR4OoOKeITy54khBNzcTxPGzxtuqHS+8ZxRaM7nWiHAZdMLCMWEXXEJWAVuAKkQAYY/zEgA1LgCrAGrAC/A3XEr4hFjDWEAQWBA7oEVan7I8uGa0nyFm3wtGFHCAfGcM+P+8g7WtMEaiZ+Q1wE1gAjHw6oYyxjLGKcw0iAK4hbEEtmty6Vyz8uJ8kPtMjRBsGxJ1xU9KxfCpw3sWBiGUjJn4AeHP8yIMFYIOM0GbvlvaRnaIOnRYP94bFHnD/6kPOs10UTvyAu03kRcBkw/q9bgNmNSaVyoZbUv6IFEa0Sd+2Xn2ad6ibOc21mLaMb0SfRKgFdiMsYVzMkx7Q1+2nRnzF6KT3MhcM6AAAAAElFTkSuQmCC"
  },
  {
    "width": 40,
    "height": 10,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAAAklEQVR4AewaftIAAAGsSURBVK3BvWtTURjA4d/7nnsFtTmKZlAsJ6GttC5CFRQJQhfBjkVwc3DqoJMfFAURLFK0Q0HQ/hkO6qKbSMFBu1awgleRhoLNNRrhpjnHwaGIJrlJfR5hG5xzUQyXj6CVSdHibhELhG8h1J8FX13FL2XwKEmSTfok9GHIudJJdO6cmjMjosWDAsKfPPAlwPvQWn/s/YvX+JsfkuQjPRJ6NObc1VsaX6uIHtgl5NII8Cr4tVnfXHiXJPfpgaEHU668OKfx9ROqe2Iht1hgWGSggpnYsHZwJa09JSdDTlOuvDij0fRhFUOfiiJmHD1WtXZwJa09IQdDDqOudOOexldGVAzbZEVkDD26bAuspelLujB0Merc6VmNHxxXHeA/2S+iZWT8rS0sf03TVTqI6OK8mLsV0X10sBmEBtAAMqAJeH5TIAJ2ABFgCBSAU6J7L4i5cxue04Ghg+FS6dKMRtNFEeEfsiCsI1SBH0AGtIDAlgC0gAz4CXwGPhGoAQXk0BtrGxtpukQbER1cFHN2CElC4C91hGqAwJYmIEBEezsR6ni+AxEwKTrxEOZp4xe5o39PtARDAgAAAABJRU5ErkJggg=="
  },
  {
    "width": 20,
    "height": 5,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAFCAYAAABFA8wzAAAAAklEQVR4AewaftIAAADeSURBVHXBsS5DYRgG4Pf9/v6TFA2hy98TZ7D2BgxsRhKX0bHdOtocicnsDrgIC4OE3RE5kRiEUz3Vr0nbj6FDHfU8xD/iEFY74o+b5M4SuY4fhdnbvU2vk+m4m2ZZjgWIBQ5DdNB2ldOYjB3xy8SAR7M0mYzbV9nzJUocSrZDY/fM+YtYGIT4QwiskbUmZe+2Wr17/ew9YY6g5Nz5k0i4iRkz4suI3Ih3I3IjCiPq5EbifIIShzmdaKu1L3JUARWgFqC+GPUD1AGoQ1AHoPZBTWE6Amp+eUUfevkNZr4BbhtPILxscOAAAAAASUVORK5CYII="
  },
  {
    "width": 10,
    "height": 3,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAADCAYAAACqPZ51AAAAAklEQVR4AewaftIAAABwSURBVGNkgIJAGTmtBhbWibyMDEYMQPDpP8O5hj+/CzY8eXSVAQiYGKCgiYV1kSQTowsnA6MQMwOjkDAjo0sDC+siBihgZgCCEjlFS0dGJp0//xluPPjPeOPDf8YbH/4z3njB8P8jCx/fk0ufPj4GACQ9IjUSTlLmAAAAAElFTkSuQmCC"
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = simLauncher.createLock( mipmap.img );
  mipmap.img.onload = unlock;
  mipmap.img.src = mipmap.url; // trigger the loading of the image for its level
  mipmap.canvas = document.createElement( 'canvas' );
  mipmap.canvas.width = mipmap.width;
  mipmap.canvas.height = mipmap.height;
  const context = mipmap.canvas.getContext( '2d' );
  mipmap.updateCanvas = () => {
    if ( mipmap.img.complete && ( typeof mipmap.img.naturalWidth === 'undefined' || mipmap.img.naturalWidth > 0 ) ) {
      context.drawImage( mipmap.img, 0, 0 );
      delete mipmap.updateCanvas;
    }
  };
} );
export default mipmaps;