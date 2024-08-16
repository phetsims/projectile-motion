/* eslint-disable */
import MipmapElement from '../../phet-core/js/MipmapElement.js';

// The levels in the mipmap. Specify explicit types rather than inferring to assist the type checker, for this boilerplate case.
const mipmaps = [
  new MipmapElement( 160, 135, 'data:image/png;base64,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' ),
  new MipmapElement( 80, 68, 'data:image/png;base64,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' ),
  new MipmapElement( 40, 34, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAiCAYAAAAtZZsLAAAAAklEQVR4AewaftIAAANvSURBVM3By29UdRjH4c/3nXOmM73MtKWAdMppGcQilgUREYxxI3gLe2+J0QUJO3f+B+50YaKJJv4HJm69xJ0b90bjwusYw6VCKe1QOtNzXqH5lZxOp7CwHeZ5xDaOJMn5T6345XFTTI4D11wssFXLwYBIbCsD5snY0PBs7eNs7Y1fG40v6MLYxosqXHxcislx4LKLBborCiJxXwYMIDZMyaJT2AW2YXRRT5J9z8uejcQ9Dlxyscz/V0JsMGBOdqaeJDW6MLqI4d1jsio58y6a7IwimyXScAm9RxdGF+8oOjsm7ll0scjOMSBGbBiUOCd7ji6MDvUk2TcnHSNYdTHPzovZbFKarSfJFB2MDkIXZmTD3JG5uAQ4Oy9G5D2CyoKLdDA6vCJ7Zp9Y9y/QZndEbDYicQY7RQejw2nsMe5oulhk9xTY6rDsCB2MnENJsn9CJKmLK+wuAQU2GxFT9SQ5TI6RU0BvHZAV54GU3VdA5I2jyNDr5Bg5k2iuhFiiN4zNKhL74QlyjJxzsplr9I6xmQEnZQfJMXJK6GBG7xhbjaApcoycKtpDDxmi04jYQ44R1Ken50qiwkNWguF6kpwgMIKC+wsVRC+JrYYQBedlAiNIoTaMeNiGEKk0QWAENWyyLHrK2GpAUIMagREclU3QJ6axcQIjmEFl+kRNDBIYgWCcvqFxAiMowiA95nQ3AGUCIxhGET3mdDcIEYERFEWRPhGJAQIjSJ0SPeZ0lzplAiPIxDB9wsUQQeHJ48lrn39S/Wi1onrzKrTbkKWiKHZdG2jh3LXi0JTTHITsjPv5Nyuz1xeqf+j7r5NfTj/lswSLN8XyMtxeheaSWFsBb4k4hbQtbjUBh/Yt4Sm4s4XEOkVOXGZdsQSlMqRyUgMNOFEM1XEwc+IYRkedUol17vDNd/ohGhslIadacaoVAudhkeDQDHVrtbhJn1pa4nrh6JHq4dqkTlRGMPpAlsHVefHnX7rx/gd8KO44Njv99ktnefXpk0yUBnzv3r0Us4wKMDRYhsoImIEEcQwSxDFEBedBWm2RppBlsLYGWQatFiw3YeU2aRyz2GzSvL6glaVlv/zVt8z/+BM/t9t89nuj8Y+4j0eTZNylMbnPZM6ByqjGbt7wSe4yGY54sAx3L0S0SmWuNpe5JLgCNH5rNP7mAf4D19rtlUTlFhIAAAAASUVORK5CYII=' ),
  new MipmapElement( 20, 17, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAARCAYAAADdRIy+AAAAAklEQVR4AewaftIAAAGrSURBVKXBvWpTcRzH4c/3d87JyZtoqoQ4nNAgVjJYrK6C0MXJl0XQ4uhUBK/A2dkb0MWht+EFFJyrCFIRpVXT1iZt3n7+NQdjJ9v4POIvr+cvrLdNVx3YdtFhYuwgQOKPLrCHszkev3ny4f0SOSO3kGU3G9IiwZaLDlMmkDgiZWJOutzOmrfJGbmnljysiXjHxQ7/FgERUJGiexbdJ2fkLkpLfRdbHF+C+KWBrpAzglaWVUuo9Rlwji9mIpXmW1k2R2AEdWzFpfIhJxMxUYXSWdkDAiO4q2hpn5MzJhKJZdkigRHUpSYzEFN1yAiMoITqzEBMpahOYASJqDEDMZWIMwRGEEOF/xShKoERGJSZgTNlUCIwAkMJM3CmBAWCaO1F9nj0KbpV+CbFnMwY6AGH7nTPe7S8Wn0X37jOs3N3DrTfFb0eDA+EhjAYiPEQ3PlNBAKLIUnAzVECxZKTplAsura39Tzu9egA1UrZqZQJnFkc9sXuD76ovdC8tvqIlfYlb6SpaqdPUUAURyMvFRIk44h+Xw4M48i7u3v0B0O+b37U11drvrHxlpc/ATHDcNAVFBCGAAAAAElFTkSuQmCC' ),
  new MipmapElement( 10, 9, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAJCAYAAAALpr0TAAAAAklEQVR4AewaftIAAADPSURBVIXBv0pCYRzH4c/3fV+PFvTv6CCFYkS7ICmO4Q24OLS0dj8tLbU0RhfS0DUEEVG4RQQej+f9dTBoSel5ROmxc3TXlCavQG4sSfABvMR4f/H8NAmUtmDwBiwAiV8JsCkNKLl+q93/RAdz/gpABfZ7rfbQnSuMMuFZwQGJ5Mfyp64hHbKG+JFKHVeTUv5RRakrjtmNrGZANCM2bSeMbmZD72ExFzEHM5ZcAHlIqkaWcRKub3XW69Kt72kb4oavIEp5plgU9vU+1fTyiodvM1I3eVEq1qoAAAAASUVORK5CYII=' )
];

export default mipmaps;