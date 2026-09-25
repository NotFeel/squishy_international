import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const products = JSON.parse(
  fs.readFileSync(path.join(root, "data/products.json"), "utf8"),
);

const svgOpen = (width, height, body, className = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" class="${className}">${body}</svg>`;

const face = (cx, cy, scale = 1) => `
  <g transform="translate(${cx} ${cy}) scale(${scale})" fill="#20252A">
    <ellipse cx="-26" cy="-6" rx="5" ry="7"/>
    <ellipse cx="26" cy="-6" rx="5" ry="7"/>
    <path d="M-13 12 Q0 22 13 12" stroke="#20252A" stroke-width="5" stroke-linecap="round" fill="none"/>
    <circle cx="-43" cy="15" r="9" fill="#ff9b93" opacity=".62"/>
    <circle cx="43" cy="15" r="9" fill="#ff9b93" opacity=".62"/>
  </g>`;

const sparkle = (x, y, color, scale = 1) => `
  <path d="M0 -18 C3 -6 6 -3 18 0 C6 3 3 6 0 18 C-3 6 -6 3 -18 0 C-6 -3 -3 -6 0 -18Z" transform="translate(${x} ${y}) scale(${scale})" fill="${color}" opacity=".85"/>`;

function shape(type, palette, variant = "cover") {
  const [bg, main, accent] = palette;
  const dark = "#20252A";
  const cream = "#FFFDF8";
  const cx = 320;
  const cy = 270;
  const scale = variant === "detail" ? 1.26 : 1;

  const shapes = {
    panda: `
      <ellipse cx="220" cy="176" rx="48" ry="50" fill="${dark}"/>
      <ellipse cx="420" cy="176" rx="48" ry="50" fill="${dark}"/>
      <ellipse cx="320" cy="313" rx="158" ry="146" fill="${cream}" stroke="#E9E3DE" stroke-width="5"/>
      <ellipse cx="225" cy="250" rx="45" ry="58" fill="${dark}" transform="rotate(25 225 250)"/>
      <ellipse cx="415" cy="250" rx="45" ry="58" fill="${dark}" transform="rotate(-25 415 250)"/>
      <ellipse cx="232" cy="257" rx="15" ry="19" fill="${cream}"/>
      <ellipse cx="408" cy="257" rx="15" ry="19" fill="${cream}"/>
      <ellipse cx="320" cy="333" rx="23" ry="16" fill="${accent}"/>
      ${face(320, 310, 1.07)}
      <ellipse cx="320" cy="421" rx="105" ry="25" fill="${main}" opacity=".34"/>`,
    cat: `
      <path d="M202 208 L208 95 Q211 78 228 89 L289 128 Q320 114 351 128 L412 89 Q429 78 432 95 L438 208Z" fill="${cream}" stroke="#E9E3DE" stroke-width="5"/>
      <path d="M226 170 L229 116 L270 145Z" fill="${accent}" opacity=".7"/>
      <path d="M414 170 L411 116 L370 145Z" fill="${accent}" opacity=".7"/>
      <ellipse cx="320" cy="330" rx="160" ry="148" fill="${cream}" stroke="#E9E3DE" stroke-width="5"/>
      <path d="M184 242 Q224 214 265 240" stroke="${main}" stroke-width="15" stroke-linecap="round" opacity=".55"/>
      <path d="M456 242 Q416 214 375 240" stroke="${main}" stroke-width="15" stroke-linecap="round" opacity=".55"/>
      ${face(320, 314, 1.08)}
      <path d="M281 358 Q320 387 359 358 Q347 401 320 406 Q293 401 281 358Z" fill="${accent}" opacity=".35"/>
      <ellipse cx="320" cy="423" rx="105" ry="24" fill="${main}" opacity=".32"/>`,
    bear: `
      <circle cx="211" cy="174" r="61" fill="${main}"/>
      <circle cx="429" cy="174" r="61" fill="${main}"/>
      <circle cx="211" cy="174" r="31" fill="${accent}" opacity=".7"/>
      <circle cx="429" cy="174" r="31" fill="${accent}" opacity=".7"/>
      <ellipse cx="320" cy="322" rx="162" ry="151" fill="${main}"/>
      <ellipse cx="320" cy="347" rx="80" ry="61" fill="#FFF3DA"/>
      ${face(320, 294, 1.04)}
      <ellipse cx="320" cy="342" rx="19" ry="13" fill="${dark}"/>
      <ellipse cx="320" cy="424" rx="105" ry="23" fill="${accent}" opacity=".36"/>`,
    strawberry: `
      <path d="M320 153 C408 153 467 213 450 319 C435 413 363 471 320 496 C277 471 205 413 190 319 C173 213 232 153 320 153Z" fill="${main}"/>
      <path d="M320 154 C299 121 278 105 248 101 C257 132 279 154 320 154Z" fill="${accent}"/>
      <path d="M320 154 C341 121 362 105 392 101 C383 132 361 154 320 154Z" fill="${accent}"/>
      <path d="M320 154 C305 118 310 91 320 72 C330 91 335 118 320 154Z" fill="${accent}"/>
      <g fill="#FFE8B8" opacity=".9">
        <ellipse cx="258" cy="250" rx="8" ry="11" transform="rotate(-24 258 250)"/>
        <ellipse cx="373" cy="247" rx="8" ry="11" transform="rotate(24 373 247)"/>
        <ellipse cx="246" cy="330" rx="8" ry="11" transform="rotate(-30 246 330)"/>
        <ellipse cx="386" cy="334" rx="8" ry="11" transform="rotate(30 386 334)"/>
        <ellipse cx="320" cy="284" rx="8" ry="11"/>
        <ellipse cx="319" cy="390" rx="8" ry="11"/>
      </g>
      ${face(320, 342, .9)}
      <ellipse cx="320" cy="488" rx="110" ry="21" fill="${accent}" opacity=".25"/>`,
    toast: `
      <path d="M226 191 Q226 114 320 114 Q414 114 414 191 L419 436 Q419 486 369 486 H271 Q221 486 221 436Z" fill="${main}" stroke="#D19254" stroke-width="7"/>
      <path d="M250 184 Q250 143 320 143 Q390 143 390 184 L394 425 Q394 458 361 458 H279 Q246 458 246 425Z" fill="#F8E7BD"/>
      <path d="M273 260 Q310 236 346 252 Q380 269 370 307 Q354 337 316 326 Q278 316 273 260Z" fill="${accent}" stroke="#E1B33E" stroke-width="5"/>
      ${face(320, 360, .9)}
      <ellipse cx="320" cy="484" rx="107" ry="20" fill="${main}" opacity=".3"/>`,
    croissant: `
      <path d="M175 345 Q182 232 276 178 Q310 160 320 196 Q330 160 364 178 Q458 232 465 345 Q460 408 405 429 Q360 446 320 402 Q280 446 235 429 Q180 408 175 345Z" fill="${main}" stroke="#D18F37" stroke-width="7"/>
      <path d="M217 324 Q242 244 287 221" stroke="${accent}" stroke-width="22" stroke-linecap="round"/>
      <path d="M423 324 Q398 244 353 221" stroke="${accent}" stroke-width="22" stroke-linecap="round"/>
      <path d="M248 378 Q282 333 320 399 Q358 333 392 378" stroke="#F6D69C" stroke-width="16" stroke-linecap="round"/>
      ${face(320, 263, .82)}
      <ellipse cx="320" cy="432" rx="105" ry="22" fill="${main}" opacity=".28"/>`,
    mushroom: `
      <path d="M271 304 Q253 396 236 432 H404 Q387 396 369 304Z" fill="#FFF5DF" stroke="#E9DFC9" stroke-width="5"/>
      <path d="M176 277 Q181 138 320 138 Q459 138 464 277 Q420 326 320 328 Q220 326 176 277Z" fill="${main}" stroke="#D94B4D" stroke-width="6"/>
      <ellipse cx="257" cy="222" rx="26" ry="18" fill="#FFF2DC"/>
      <ellipse cx="364" cy="198" rx="30" ry="21" fill="#FFF2DC"/>
      <ellipse cx="397" cy="260" rx="22" ry="16" fill="#FFF2DC"/>
      ${face(320, 350, .82)}
      <ellipse cx="320" cy="432" rx="103" ry="22" fill="${main}" opacity=".25"/>`,
    cloud: `
      <path d="M178 359 Q129 348 139 295 Q149 247 202 247 Q215 170 296 166 Q375 162 402 233 Q474 225 494 286 Q514 351 459 372Z" fill="${cream}" stroke="#DCEAF1" stroke-width="7"/>
      <path d="M178 359 Q129 348 139 295 Q149 247 202 247 Q215 170 296 166 Q375 162 402 233 Q474 225 494 286" stroke="${main}" stroke-width="10" stroke-linecap="round" opacity=".42"/>
      ${face(323, 301, 1.02)}
      <path d="M290 370 Q320 399 350 370" stroke="${accent}" stroke-width="7" stroke-linecap="round" fill="none"/>
      <ellipse cx="320" cy="390" rx="110" ry="23" fill="${main}" opacity=".24"/>`,
    cube: `
      <rect x="161" y="138" width="318" height="318" rx="82" fill="${main}"/>
      <path d="M211 191 L429 191" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" opacity=".22"/>
      ${face(320, 303, 1.12)}
      <ellipse cx="320" cy="444" rx="118" ry="23" fill="${accent}" opacity=".32"/>`,
    sprout: `
      <path d="M320 172 C280 121 249 116 226 125 C236 177 272 201 320 199Z" fill="${accent}" stroke="#68A568" stroke-width="6"/>
      <path d="M320 198 C363 135 401 122 430 133 C421 190 382 216 320 216Z" fill="${main}" stroke="#68A568" stroke-width="6"/>
      <path d="M320 211 V291" stroke="#68A568" stroke-width="15" stroke-linecap="round"/>
      <ellipse cx="320" cy="351" rx="139" ry="126" fill="#FFF7E8" stroke="#EDE4D5" stroke-width="5"/>
      ${face(320, 340, .98)}
      <path d="M237 366 Q276 401 320 368 Q364 401 403 366" stroke="${main}" stroke-width="10" stroke-linecap="round" opacity=".32"/>
      <ellipse cx="320" cy="446" rx="105" ry="22" fill="${main}" opacity=".25"/>`,
    mascot: `
      <path d="M250 186 L274 102 L326 168 L374 102 L398 186 Q452 236 438 350 Q421 451 320 465 Q219 451 202 350 Q188 236 250 186Z" fill="${main}" stroke="#EF716A" stroke-width="7"/>
      <path d="M253 183 Q320 138 387 183" stroke="${accent}" stroke-width="15" stroke-linecap="round" opacity=".55"/>
      ${face(320, 306, 1.1)}
      <path d="M267 393 Q320 424 373 393" stroke="${accent}" stroke-width="10" stroke-linecap="round" fill="none"/>
      <ellipse cx="320" cy="452" rx="112" ry="22" fill="${main}" opacity=".25"/>`,
    bundle: `
      <circle cx="211" cy="327" r="95" fill="#FFD2A8"/>
      <circle cx="429" cy="327" r="95" fill="${main}"/>
      <circle cx="320" cy="241" r="108" fill="${accent}"/>
      <circle cx="211" cy="333" r="62" fill="#FFF7E8" opacity=".22"/>
      <circle cx="429" cy="333" r="62" fill="#FFF7E8" opacity=".22"/>
      <circle cx="320" cy="247" r="65" fill="#FFF7E8" opacity=".22"/>
      ${face(211, 340, .48)}
      ${face(429, 340, .48)}
      ${face(320, 257, .55)}
      <ellipse cx="320" cy="431" rx="175" ry="28" fill="${accent}" opacity=".3"/>`,
  };

  return `
    <g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})">
      <ellipse cx="320" cy="440" rx="178" ry="39" fill="${dark}" opacity=".11"/>
      ${shapes[type] || shapes.bundle}
    </g>`;
}

function cover(product) {
  const [bg, main, accent] = product.palette;
  return svgOpen(
    640,
    640,
    `<defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect width="640" height="640" rx="44" fill="url(#bg)"/>
    <circle cx="92" cy="103" r="118" fill="${main}" opacity=".13" filter="url(#blur)"/>
    <circle cx="559" cy="518" r="135" fill="${accent}" opacity=".17" filter="url(#blur)"/>
    <path d="M44 496 Q141 430 234 469" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round" opacity=".65"/>
    ${sparkle(100, 190, main, .85)}
    ${sparkle(528, 145, accent, .7)}
    ${shape(product.artType, product.palette, "cover")}
    <rect x="24" y="24" width="592" height="592" rx="34" stroke="#FFFFFF" stroke-opacity=".66"/>`,
    "product-art",
  );
}

function detail(product) {
  const [bg, main, accent] = product.palette;
  return svgOpen(
    640,
    640,
    `<rect width="640" height="640" rx="44" fill="#FBFBF8"/>
    <path d="M37 319 H603" stroke="${main}" stroke-width="2" stroke-dasharray="8 10" opacity=".45"/>
    <path d="M320 34 V606" stroke="${accent}" stroke-width="2" stroke-dasharray="8 10" opacity=".5"/>
    <path d="M76 105 H565 M76 96 V114 M565 96 V114" stroke="#20252A" stroke-width="3"/>
    <path d="M72 534 H568 M72 525 V543 M568 525 V543" stroke="#20252A" stroke-width="3" opacity=".5"/>
    <circle cx="56" cy="56" r="84" fill="${bg}"/>
    <circle cx="584" cy="584" r="105" fill="${main}" opacity=".12"/>
    ${shape(product.artType, product.palette, "detail")}
    <path d="M91 82 Q104 117 139 130 Q104 143 91 178 Q78 143 43 130 Q78 117 91 82Z" fill="${accent}" opacity=".82"/>
    <circle cx="538" cy="100" r="22" fill="${main}" opacity=".28"/>`,
  );
}

function lifestyle(product) {
  const [bg, main, accent] = product.palette;
  return svgOpen(
    800,
    640,
    `<defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#FFF"/></linearGradient></defs>
    <rect width="800" height="640" rx="44" fill="url(#wall)"/>
    <rect y="444" width="800" height="196" fill="#E9DED0"/>
    <path d="M0 444 H800" stroke="#D8C7B5" stroke-width="5"/>
    <rect x="485" y="140" width="220" height="254" rx="110" fill="#FFF" stroke="#E5DDD3" stroke-width="6"/>
    <rect x="516" y="179" width="158" height="180" rx="78" fill="${accent}" opacity=".21"/>
    <path d="M555 338 Q594 280 637 338" stroke="${main}" stroke-width="12" stroke-linecap="round" opacity=".55"/>
    <rect x="87" y="85" width="126" height="170" rx="12" fill="#FFF9EF" stroke="#E7D9C8" stroke-width="5"/>
    <path d="M115 157 C142 121 183 119 197 137 C186 176 151 190 115 177Z" fill="${main}" opacity=".6"/>
    <rect x="596" y="355" width="108" height="89" rx="12" fill="${main}" opacity=".72"/>
    <path d="M619 381 H681 M619 408 H658" stroke="#FFF" stroke-width="7" stroke-linecap="round" opacity=".74"/>
    <g transform="translate(130 -2) scale(.78)">
      <ellipse cx="320" cy="440" rx="178" ry="39" fill="#20252A" opacity=".11"/>
      ${shape(product.artType, product.palette, "cover")}
    </g>
    ${sparkle(652, 105, main, .75)}
    ${sparkle(90, 360, accent, .65)}`,
  );
}

function packaging(product) {
  const [bg, main, accent] = product.palette;
  return svgOpen(
    800,
    640,
    `<rect width="800" height="640" rx="44" fill="${bg}"/>
    <circle cx="128" cy="112" r="108" fill="${accent}" opacity=".22"/>
    <circle cx="711" cy="525" r="150" fill="${main}" opacity=".13"/>
    <path d="M437 79 L681 79 L663 479 Q660 526 613 526 H507 Q460 526 457 479Z" fill="#FFFCF7" stroke="#E4D9CB" stroke-width="6"/>
    <path d="M538 80 V190" stroke="#DED2C5" stroke-width="5"/>
    <path d="M554 80 V190" stroke="#DED2C5" stroke-width="5"/>
    <rect x="486" y="237" width="157" height="115" rx="23" fill="${accent}" opacity=".72"/>
    <circle cx="564" cy="273" r="17" fill="${main}" opacity=".7"/>
    <path d="M522 314 Q562 336 605 314" stroke="#FFF" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-174 22) scale(.72)">
      ${shape(product.artType, product.palette, "cover")}
    </g>
    <rect x="80" y="397" width="190" height="104" rx="18" fill="#FFF" stroke="#E4D9CB" stroke-width="5"/>
    <path d="M111 428 H233 M111 460 H197" stroke="${main}" stroke-width="9" stroke-linecap="round" opacity=".62"/>`,
  );
}

for (const product of products) {
  const dir = path.join(root, "public", "products", product.slug);
  fs.mkdirSync(dir, { recursive: true });
  const views = {
    "01-cover": cover(product),
    "02-detail": detail(product),
    "03-lifestyle": lifestyle(product),
    "04-packaging": packaging(product),
  };

  for (const [name, contents] of Object.entries(views)) {
    fs.writeFileSync(path.join(dir, `${name}.svg`), contents);
    await sharp(Buffer.from(contents))
      .webp({ quality: 88, effort: 5 })
      .toFile(path.join(dir, `${name}.webp`));
  }
}

const hero = svgOpen(
  1100,
  860,
  `<defs>
    <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFEDE9"/><stop offset=".55" stop-color="#FFF9F4"/><stop offset="1" stop-color="#E9F3EA"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="22" stdDeviation="20" flood-color="#6B4F45" flood-opacity=".16"/></filter>
  </defs>
  <rect width="1100" height="860" rx="52" fill="url(#heroBg)"/>
  <circle cx="150" cy="160" r="115" fill="#FFD7D1" opacity=".75"/>
  <circle cx="949" cy="702" r="165" fill="#D9EBDD" opacity=".72"/>
  <path d="M788 123 Q862 48 949 112" stroke="#FFF" stroke-width="27" stroke-linecap="round" opacity=".75"/>
  <path d="M116 674 Q197 617 273 683" stroke="#FFF" stroke-width="22" stroke-linecap="round" opacity=".8"/>
  <g filter="url(#shadow)" transform="translate(32 60) scale(.98)">${shape("panda", ["#F5ECE6", "#20252A", "#FF8D83"])}</g>
  <g filter="url(#shadow)" transform="translate(520 41) scale(.72)">${shape("strawberry", ["#F4F8EE", "#F05258", "#6CB678"])}</g>
  <g filter="url(#shadow)" transform="translate(678 318) scale(.58)">${shape("cloud", ["#EDF6FB", "#8FC9E8", "#FFF2A8"])}</g>
  <g transform="translate(340 0) scale(.42)">${shape("mushroom", ["#F4F6E9", "#E95F58", "#FFF0CF"])}</g>
  ${sparkle(128, 238, "#FF8279", 1.1)}
  ${sparkle(966, 253, "#FFD46A", 1.25)}
  ${sparkle(752, 116, "#79B8A0", .75)}
  <rect x="28" y="28" width="1044" height="804" rx="40" stroke="#FFF" stroke-opacity=".66" stroke-width="2"/>`,
);

const wholesale = svgOpen(
  1000,
  720,
  `<rect width="1000" height="720" rx="48" fill="#DDEFE4"/>
  <circle cx="840" cy="112" r="188" fill="#FFF" opacity=".48"/>
  <circle cx="118" cy="650" r="210" fill="#C6E4D1"/>
  <path d="M0 530 Q182 416 366 535 T740 508 T1000 526 V720 H0Z" fill="#F8F6EF"/>
  <g transform="translate(92 102)">
    <rect x="0" y="286" width="250" height="220" rx="20" fill="#E8C298" stroke="#C79768" stroke-width="6"/>
    <path d="M30 346 H211 M30 391 H172 M30 436 H194" stroke="#FFF5DF" stroke-width="15" stroke-linecap="round" opacity=".8"/>
    <rect x="315" y="226" width="277" height="280" rx="24" fill="#F8E0D8" stroke="#E4B9AE" stroke-width="6"/>
    <rect x="355" y="275" width="196" height="95" rx="20" fill="#FFF9F2"/>
    <path d="M387 315 H516 M387 342 H471" stroke="#FF8279" stroke-width="12" stroke-linecap="round"/>
    <circle cx="454" cy="438" r="38" fill="#FFD9D4"/>
    <rect x="667" y="275" width="210" height="231" rx="21" fill="#E8C298" stroke="#C79768" stroke-width="6"/>
    <path d="M705 336 H835 M705 383 H818" stroke="#FFF5DF" stroke-width="14" stroke-linecap="round"/>
  </g>
  <path d="M630 98 L650 160 L712 180 L650 200 L630 262 L610 200 L548 180 L610 160Z" fill="#FFD46A"/>`,
);

const oem = svgOpen(
  1000,
  720,
  `<rect width="1000" height="720" rx="48" fill="#FFF0E9"/>
  <circle cx="160" cy="107" r="180" fill="#FFD9D4" opacity=".75"/>
  <path d="M493 81 L564 46 L635 81 L564 116Z" fill="#FFD46A"/>
  <path d="M493 81 V246 L564 286 V116Z" fill="#FFE69A"/>
  <path d="M635 81 V246 L564 286 V116Z" fill="#EBC765"/>
  <g transform="translate(64 160) rotate(-6 250 230)">
    <rect x="0" y="0" width="450" height="458" rx="26" fill="#FFFCF7" stroke="#E5D6C9" stroke-width="5"/>
    <path d="M0 76 H450" stroke="#E5D6C9" stroke-width="4"/>
    <circle cx="36" cy="38" r="10" fill="#FF8279"/>
    <path d="M91 191 Q127 109 213 132 Q298 156 313 260 Q269 342 173 316 Q94 289 91 191Z" stroke="#20252A" stroke-width="7" stroke-dasharray="12 12" fill="none"/>
    <circle cx="178" cy="180" r="8" fill="#20252A"/><circle cx="252" cy="184" r="8" fill="#20252A"/>
    <path d="M189 248 Q222 274 258 240" stroke="#20252A" stroke-width="7" stroke-linecap="round"/>
    <path d="M60 389 H349" stroke="#DED3C8" stroke-width="12" stroke-linecap="round"/>
    <path d="M60 419 H274" stroke="#E8E0D8" stroke-width="12" stroke-linecap="round"/>
  </g>
  <g transform="translate(559 250)">
    <ellipse cx="165" cy="323" rx="147" ry="32" fill="#5E4036" opacity=".12"/>
    <path d="M61 102 Q92 27 167 59 Q238 90 246 181 Q198 267 112 238 Q45 214 61 102Z" fill="#FF8279"/>
    <circle cx="122" cy="153" r="10" fill="#20252A"/><circle cx="196" cy="157" r="10" fill="#20252A"/>
    <path d="M132 204 Q164 229 201 201" stroke="#20252A" stroke-width="8" stroke-linecap="round"/>
  </g>
  <path d="M810 102 Q892 77 925 154" stroke="#FF8279" stroke-width="17" stroke-linecap="round"/>
  <circle cx="908" cy="574" r="48" fill="#DDEFE4"/>`,
);

const about = svgOpen(
  1000,
  720,
  `<rect width="1000" height="720" rx="48" fill="#F9F6F0"/>
  <rect y="492" width="1000" height="228" fill="#E4D8CA"/>
  <path d="M112 142 H875 V492 H112Z" fill="#FFFDF8" stroke="#E6DED4" stroke-width="6"/>
  <path d="M499 142 V492" stroke="#E8E0D7" stroke-width="5"/>
  <path d="M112 303 H875" stroke="#E8E0D7" stroke-width="5"/>
  <g fill="#D9E9DD" stroke="#B8D5C2" stroke-width="5">
    <rect x="161" y="198" width="256" height="72" rx="14"/>
    <rect x="571" y="198" width="256" height="72" rx="14"/>
    <rect x="161" y="359" width="256" height="72" rx="14"/>
    <rect x="571" y="359" width="256" height="72" rx="14"/>
  </g>
  <g fill="#FFD9D4">
    <circle cx="227" cy="234" r="22"/><circle cx="358" cy="234" r="22"/>
    <circle cx="636" cy="234" r="22"/><circle cx="767" cy="234" r="22"/>
    <circle cx="227" cy="395" r="22"/><circle cx="358" cy="395" r="22"/>
    <circle cx="636" cy="395" r="22"/><circle cx="767" cy="395" r="22"/>
  </g>
  <rect x="414" y="557" width="170" height="92" rx="16" fill="#E8C298" stroke="#C79768" stroke-width="5"/>
  <path d="M444 608 H553" stroke="#FFF5DF" stroke-width="12" stroke-linecap="round"/>
  <path d="M148 84 H344" stroke="#FF8279" stroke-width="20" stroke-linecap="round"/>
  <path d="M148 112 H257" stroke="#E8E0D7" stroke-width="14" stroke-linecap="round"/>`,
);

const lifestyleBrand = svgOpen(
  1200,
  760,
  `<rect width="1200" height="760" rx="52" fill="#F6F0E8"/>
  <circle cx="1032" cy="124" r="250" fill="#FFF" opacity=".62"/>
  <rect y="555" width="1200" height="205" fill="#E7D8C9"/>
  <path d="M0 555 H1200" stroke="#D4C0AC" stroke-width="6"/>
  <rect x="101" y="91" width="296" height="464" rx="18" fill="#FFFDF8" stroke="#E4D8CA" stroke-width="6"/>
  <path d="M249 91 V555 M101 316 H397" stroke="#E4D8CA" stroke-width="6"/>
  <rect x="141" y="142" width="216" height="106" rx="16" fill="#DDEFE4"/>
  <rect x="141" y="376" width="216" height="97" rx="16" fill="#FFD9D4"/>
  <rect x="449" y="183" width="326" height="372" rx="20" fill="#F0D4AE" stroke="#D2AD80" stroke-width="6"/>
  <path d="M496 252 H727 M496 308 H681" stroke="#FFF8EA" stroke-width="18" stroke-linecap="round" opacity=".9"/>
  <circle cx="612" cy="422" r="75" fill="#FFF4E1"/>
  <circle cx="585" cy="407" r="9" fill="#20252A"/><circle cx="639" cy="407" r="9" fill="#20252A"/>
  <path d="M589 446 Q612 466 636 446" stroke="#20252A" stroke-width="7" stroke-linecap="round"/>
  <rect x="839" y="287" width="254" height="268" rx="125" fill="#FFF" stroke="#E4D8CA" stroke-width="6"/>
  <g transform="translate(812 300) scale(.62)">
    <ellipse cx="320" cy="440" rx="178" ry="39" fill="#20252A" opacity=".11"/>
    ${shape("cat", ["#FFF9F0", "#F5C57C", "#FF8D83"])}
  </g>
  <path d="M779 131 Q852 63 934 114" stroke="#FFF" stroke-width="25" stroke-linecap="round" opacity=".85"/>
  ${sparkle(945, 202, "#FFD46A", 1.25)}
  ${sparkle(84, 503, "#FF8279", .85)}`,
);

const favicon = svgOpen(
  64,
  64,
  `<rect width="64" height="64" rx="18" fill="#FF7A70"/>
  <circle cx="20" cy="24" r="9" fill="#FFF9F4"/>
  <circle cx="44" cy="24" r="9" fill="#FFF9F4"/>
  <path d="M17 39 Q32 53 47 39" stroke="#20252A" stroke-width="5" stroke-linecap="round" fill="none"/>
  <circle cx="18" cy="40" r="5" fill="#FFD9D4"/>
  <circle cx="46" cy="40" r="5" fill="#FFD9D4"/>`,
);

fs.mkdirSync(path.join(root, "public", "brand"), { recursive: true });
const brandFiles = {
  "hero.svg": hero,
  "wholesale.svg": wholesale,
  "oem.svg": oem,
  "about.svg": about,
  "lifestyle.svg": lifestyleBrand,
  "favicon.svg": favicon,
};

for (const [file, contents] of Object.entries(brandFiles)) {
  fs.writeFileSync(path.join(root, "public", "brand", file), contents);
}

await sharp(Buffer.from(hero))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public", "brand", "og-image.png"));

console.log(`Generated art for ${products.length} products, ${Object.keys(brandFiles).length} brand assets and 1 social image.`);
