/**
 * Adobe Helium: symbol definitions
 */
window.symbols = {
"stage": {
   version: "0.1",
   baseState: "Base State",
   initialState: "Base State",
   parameters: {

   },
   content: {
      dom: [
        {
            id:'SVGImage3',
            type:'image',
            rect:[0,0,270,102],
            opacity:0.25,
            fill:['rgba(0,0,0,0)','../assets/jsdoit_logo.svg'],
            transform:[[100,191]],
        },
        {
            id:'SVGImage2',
            type:'image',
            rect:[0,0,270,102],
            opacity:0,
            fill:['rgba(0,0,0,0)','../assets/jsdoit_logo.svg'],
            transform:[[100,191]],
        },
        {
            id:'SVGImage1',
            type:'image',
            rect:[0,0,270,102],
            fill:['rgba(0,0,0,0)','../assets/jsdoit_logo.svg'],
            transform:[[529.19998],,[-16]],
        },
        {
            id:'Rectangle1',
            type:'rect',
            rect:[99,183,33,27],
            fill:['rgba(192,192,192,1)'],
            stroke:[0,"rgba(0,0,0,1)","none"],
        },
        {
            id:'Rectangle2',
            type:'rect',
            rect:[309,186,31,26],
            fill:['rgba(255,255,255,1)'],
            stroke:[0,"rgb(0, 0, 0)","none"],
        },
        {
            id:'Text5',
            type:'text',
            rect:[117,21,238,32],
            text:"意外性を出して",
            align:"center",
            font:["Times",16,"rgba(0,0,0,1)","normal","none","normal"],
            transform:[[6]],
        },
        {
            id:'Text4',
            type:'text',
            rect:[120.00001144409,25.200000762939,243.60003662109,30.000003814697],
            text:"生きている感じ",
            align:"center",
            font:["Verdana, Geneva, sans-serif",24,"rgba(0,0,0,1)","normal","none","normal"],
            transform:[[-7]],
        },
        {
            id:'Text3',
            type:'text',
            rect:[106.80000686646,22.800003051758,253.20003509521,28.800003051758],
            text:"シュッと",
            align:"center",
            font:["Verdana, Geneva, sans-serif",24,"rgba(0,0,0,1)","normal","none","normal"],
            transform:[[2.39999]],
        },
        {
            id:'Text2',
            type:'text',
            rect:[159.60001802444,27.600002765656,253.20003509522,31.200004577637],
            text:"ドンッって感じ",
            align:"center",
            font:["Verdana, Geneva, sans-serif",24,"rgba(0,0,0,1)","normal","none","normal"],
            transform:[[-55.20001]],
        },
        {
            id:'Text1',
            type:'text',
            rect:[160.80001497269,28.800003528595,168.00001525879,33.600002288818],
            text:"普通に",
            align:"center",
            font:["Verdana, Geneva, sans-serif",24,"rgba(0,0,0,1)","normal","none",""],
        },
      ],
      symbolInstances: [
      ],
   },
   states: {
      "Base State": {
         "#stage": [
            ["style", "height", '465px'],
            ["style", "overflow", 'hidden'],
            ["color", "background-color", 'rgba(255,255,255,1)'],
            ["style", "width", '465px']
         ],
         "#Text4": [
            ["style", "opacity", '1'],
            ["transform", "translateY", '-100px'],
            ["transform", "translateX", '-7px']
         ],
         "#Text5": [
            ["style", "text-align", 'center'],
            ["transform", "translateX", '6px'],
            ["style", "height", '31px'],
            ["style", "opacity", '1'],
            ["transform", "translateY", '-100px'],
            ["style", "font-size", '24px']
         ],
         "#SVGImage2": [
            ["transform", "translateX", '100px'],
            ["transform", "scaleX", '1'],
            ["style", "opacity", '0'],
            ["transform", "translateY", '190.79996px'],
            ["transform", "scaleY", '1']
         ],
         "#SVGImage3": [
            ["style", "opacity", '0'],
            ["transform", "translateY", '190.79996px'],
            ["transform", "translateX", '100px']
         ],
         "#Rectangle2": [
            ["style", "height", '3px'],
            ["style", "opacity", '0'],
            ["transform", "translateY", '1px'],
            ["transform", "translateX", '2px']
         ],
         "#SVGImage1": [
            ["transform", "originX", '50%'],
            ["transform", "translateX", '100px'],
            ["transform", "scaleX", '1'],
            ["style", "opacity", '0'],
            ["transform", "scaleY", '1'],
            ["transform", "skewX", '0deg'],
            ["style", "-webkit-transform-origin", [50,50],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-moz-transform-origin", [50,50],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-ms-transform-origin", [50,50],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "msTransformOrigin", [50,50],{valueTemplate:'@@0@@% @@1@@%'}],
            ["style", "-o-transform-origin", [50,50],{valueTemplate:'@@0@@% @@1@@%'}],
            ["transform", "originY", '50%'],
            ["transform", "translateY", '203.99998px'],
            ["transform", "skewY", '0']
         ],
         "#Rectangle1": [
            ["color", "background-color", 'rgba(255,255,255,1.00)'],
            ["style", "opacity", '0'],
            ["style", "height", '3px'],
            ["style", "width", '33px']
         ],
         "#Text3": [
            ["transform", "translateY", '-100px'],
            ["style", "opacity", '1']
         ],
         "#Text2": [
            ["transform", "translateY", '-100px'],
            ["style", "opacity", '1'],
            ["transform", "translateX", '-55.20001px'],
            ["style", "width", '253.20003509522px']
         ],
         "#Text1": [
            ["transform", "translateX", '0'],
            ["style", "text-align", 'center'],
            ["style", "font-family", 'Verdana, Geneva, sans-serif'],
            ["style", "opacity", '1'],
            ["transform", "translateY", '-100px'],
            ["style", "width", '148.80003356934px']
         ]
      }
   },
   actions: {

   },
   bindings: [

   ],
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 12000,
         timeline: [
            { id: "eid242", tween: [ "style", "#Rectangle1", "opacity", '1', { valueTemplate: undefined, fromValue: '0'}], position: 7629, duration: 9, easing: "linear" },
            { id: "eid380", tween: [ "style", "#Rectangle1", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 8000, duration: 0, easing: "linear" },
            { id: "eid210", tween: [ "style", "#Rectangle1", "height", '27.861237001523px', { valueTemplate: undefined, fromValue: '3px'}], position: 7629, duration: 60, easing: "linear" },
            { id: "eid212", tween: [ "style", "#Rectangle1", "height", '4.5832716200791px', { valueTemplate: undefined, fromValue: '27.861237001523px'}], position: 7689, duration: 60, easing: "linear" },
            { id: "eid213", tween: [ "style", "#Rectangle1", "height", '27.624172005253px', { valueTemplate: undefined, fromValue: '4.5832716200791px'}], position: 7750, duration: 63, easing: "linear" },
            { id: "eid214", tween: [ "style", "#Rectangle1", "height", '2px', { valueTemplate: undefined, fromValue: '27.624172005253px'}], position: 7813, duration: 65, easing: "linear" },
            { id: "eid72", tween: [ "transform", "#SVGImage1", "skewX", '-16deg', { valueTemplate: undefined, fromValue: '0deg'}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid74", tween: [ "transform", "#SVGImage1", "skewX", '16deg', { valueTemplate: undefined, fromValue: '-16deg'}], position: 5055, duration: 194, easing: "easeOutQuad" },
            { id: "eid75", tween: [ "transform", "#SVGImage1", "skewX", '0deg', { valueTemplate: undefined, fromValue: '16deg'}], position: 5250, duration: 67, easing: "easeInQuad" },
            { id: "eid338", tween: [ "transform", "#SVGImage3", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 9000, duration: 250, easing: "easeOutSine" },
            { id: "eid340", tween: [ "transform", "#SVGImage3", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 9250, duration: 250, easing: "easeInSine" },
            { id: "eid342", tween: [ "transform", "#SVGImage3", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 9500, duration: 250, easing: "easeOutSine" },
            { id: "eid344", tween: [ "transform", "#SVGImage3", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 9750, duration: 250, easing: "easeInSine" },
            { id: "eid346", tween: [ "transform", "#SVGImage3", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 10000, duration: 250, easing: "easeOutSine" },
            { id: "eid348", tween: [ "transform", "#SVGImage3", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 10250, duration: 250, easing: "easeInSine" },
            { id: "eid350", tween: [ "transform", "#SVGImage3", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 10500, duration: 250, easing: "easeOutSine" },
            { id: "eid352", tween: [ "transform", "#SVGImage3", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 10750, duration: 250, easing: "easeInSine" },
            { id: "eid354", tween: [ "transform", "#SVGImage3", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 11000, duration: 250, easing: "easeOutSine" },
            { id: "eid356", tween: [ "transform", "#SVGImage3", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 11250, duration: 250, easing: "easeInSine" },
            { id: "eid358", tween: [ "transform", "#SVGImage3", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 11500, duration: 250, easing: "easeOutSine" },
            { id: "eid360", tween: [ "transform", "#SVGImage3", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 11750, duration: 250, easing: "easeInSine" },
            { id: "eid336", tween: [ "transform", "#SVGImage3", "translateY", '165.79996px', { valueTemplate: undefined, fromValue: '190.79996px'}], position: 8866, duration: 133, easing: "linear" },
            { id: "eid337", tween: [ "transform", "#SVGImage3", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 9000, duration: 250, easing: "easeInSine" },
            { id: "eid339", tween: [ "transform", "#SVGImage3", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 9250, duration: 250, easing: "easeOutSine" },
            { id: "eid341", tween: [ "transform", "#SVGImage3", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 9500, duration: 250, easing: "easeInSine" },
            { id: "eid343", tween: [ "transform", "#SVGImage3", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 9750, duration: 250, easing: "easeOutSine" },
            { id: "eid345", tween: [ "transform", "#SVGImage3", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 10000, duration: 250, easing: "easeInSine" },
            { id: "eid347", tween: [ "transform", "#SVGImage3", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 10250, duration: 250, easing: "easeOutSine" },
            { id: "eid349", tween: [ "transform", "#SVGImage3", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 10500, duration: 250, easing: "easeInSine" },
            { id: "eid351", tween: [ "transform", "#SVGImage3", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 10750, duration: 250, easing: "easeOutSine" },
            { id: "eid353", tween: [ "transform", "#SVGImage3", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 11000, duration: 250, easing: "easeInSine" },
            { id: "eid355", tween: [ "transform", "#SVGImage3", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 11250, duration: 250, easing: "easeOutSine" },
            { id: "eid357", tween: [ "transform", "#SVGImage3", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 11500, duration: 250, easing: "easeInSine" },
            { id: "eid359", tween: [ "transform", "#SVGImage3", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 11750, duration: 250, easing: "easeOutSine" },
            { id: "eid29", tween: [ "transform", "#Text2", "translateY", '0px', { valueTemplate: undefined, fromValue: '-100px'}], position: 2000, duration: 500, easing: "easeOutQuad" },
            { id: "eid311", tween: [ "transform", "#SVGImage2", "translateY", '165.79996px', { valueTemplate: undefined, fromValue: '190.79996px'}], position: 8732, duration: 133, easing: "linear" },
            { id: "eid312", tween: [ "transform", "#SVGImage2", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 8866, duration: 250, easing: "easeInSine" },
            { id: "eid314", tween: [ "transform", "#SVGImage2", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 9116, duration: 250, easing: "easeOutSine" },
            { id: "eid316", tween: [ "transform", "#SVGImage2", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 9366, duration: 250, easing: "easeInSine" },
            { id: "eid318", tween: [ "transform", "#SVGImage2", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 9616, duration: 250, easing: "easeOutSine" },
            { id: "eid320", tween: [ "transform", "#SVGImage2", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 9866, duration: 250, easing: "easeInSine" },
            { id: "eid322", tween: [ "transform", "#SVGImage2", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 10116, duration: 250, easing: "easeOutSine" },
            { id: "eid324", tween: [ "transform", "#SVGImage2", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 10366, duration: 250, easing: "easeInSine" },
            { id: "eid326", tween: [ "transform", "#SVGImage2", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 10616, duration: 250, easing: "easeOutSine" },
            { id: "eid328", tween: [ "transform", "#SVGImage2", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 10866, duration: 250, easing: "easeInSine" },
            { id: "eid330", tween: [ "transform", "#SVGImage2", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 11116, duration: 250, easing: "easeOutSine" },
            { id: "eid332", tween: [ "transform", "#SVGImage2", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 11366, duration: 250, easing: "easeInSine" },
            { id: "eid334", tween: [ "transform", "#SVGImage2", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 11616, duration: 250, easing: "easeOutSine" },
            { id: "eid86", tween: [ "transform", "#Text4", "translateY", '1px', { valueTemplate: undefined, fromValue: '-100px'}], position: 6000, duration: 500, easing: "easeOutQuad" },
            { id: "eid263", tween: [ "style", "#Text5", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 11879, duration: 121, easing: "linear" },
            { id: "eid313", tween: [ "transform", "#SVGImage2", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 8866, duration: 250, easing: "easeOutSine" },
            { id: "eid315", tween: [ "transform", "#SVGImage2", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 9116, duration: 250, easing: "easeInSine" },
            { id: "eid317", tween: [ "transform", "#SVGImage2", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 9366, duration: 250, easing: "easeOutSine" },
            { id: "eid319", tween: [ "transform", "#SVGImage2", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 9616, duration: 250, easing: "easeInSine" },
            { id: "eid321", tween: [ "transform", "#SVGImage2", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 9866, duration: 250, easing: "easeOutSine" },
            { id: "eid323", tween: [ "transform", "#SVGImage2", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 10116, duration: 250, easing: "easeInSine" },
            { id: "eid325", tween: [ "transform", "#SVGImage2", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 10366, duration: 250, easing: "easeOutSine" },
            { id: "eid327", tween: [ "transform", "#SVGImage2", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 10616, duration: 250, easing: "easeInSine" },
            { id: "eid329", tween: [ "transform", "#SVGImage2", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 10866, duration: 250, easing: "easeOutSine" },
            { id: "eid331", tween: [ "transform", "#SVGImage2", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 11116, duration: 250, easing: "easeInSine" },
            { id: "eid333", tween: [ "transform", "#SVGImage2", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 11366, duration: 250, easing: "easeOutSine" },
            { id: "eid335", tween: [ "transform", "#SVGImage2", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 11616, duration: 250, easing: "easeInSine" },
            { id: "eid26", tween: [ "style", "#Text1", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 1878, duration: 121, easing: "linear" },
            { id: "eid59", tween: [ "transform", "#SVGImage1", "skewY", '0', { valueTemplate: undefined, fromValue: '0'}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid11", tween: [ "transform", "#SVGImage1", "translateY", '175px', { valueTemplate: undefined, fromValue: '203.99998px'}], position: 875, duration: 124, easing: "linear" },
            { id: "eid94", tween: [ "transform", "#SVGImage1", "translateY", '522.79996px', { valueTemplate: undefined, fromValue: '175px'}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid113", tween: [ "transform", "#SVGImage1", "translateY", '187px', { valueTemplate: undefined, fromValue: '522.79996px'}], position: 6500, duration: 337, easing: "easeOutQuad" },
            { id: "eid115", tween: [ "transform", "#SVGImage1", "translateY", '276px', { valueTemplate: undefined, fromValue: '187px'}], position: 6837, duration: 118, easing: "easeInQuad" },
            { id: "eid179", tween: [ "transform", "#SVGImage1", "translateY", '159.00171px', { valueTemplate: undefined, fromValue: '276px'}], position: 7030, duration: 344, easing: "linear" },
            { id: "eid120", tween: [ "transform", "#SVGImage1", "translateY", '190.79996px', { valueTemplate: undefined, fromValue: '159.00171px'}], position: 7374, duration: 125, easing: "easeInQuad" },
            { id: "eid285", tween: [ "transform", "#SVGImage1", "translateY", '165.79996px', { valueTemplate: undefined, fromValue: '190.79996px'}], position: 8599, duration: 133, easing: "linear" },
            { id: "eid288", tween: [ "transform", "#SVGImage1", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 8732, duration: 250, easing: "easeInSine" },
            { id: "eid290", tween: [ "transform", "#SVGImage1", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 8982, duration: 250, easing: "easeOutSine" },
            { id: "eid292", tween: [ "transform", "#SVGImage1", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 9232, duration: 250, easing: "easeInSine" },
            { id: "eid294", tween: [ "transform", "#SVGImage1", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 9482, duration: 250, easing: "easeOutSine" },
            { id: "eid295", tween: [ "transform", "#SVGImage1", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 9732, duration: 250, easing: "easeInSine" },
            { id: "eid296", tween: [ "transform", "#SVGImage1", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 9982, duration: 250, easing: "easeOutSine" },
            { id: "eid297", tween: [ "transform", "#SVGImage1", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 10232, duration: 250, easing: "easeInSine" },
            { id: "eid298", tween: [ "transform", "#SVGImage1", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 10482, duration: 250, easing: "easeOutSine" },
            { id: "eid303", tween: [ "transform", "#SVGImage1", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '165.79996px'}], position: 10732, duration: 250, easing: "easeInSine" },
            { id: "eid304", tween: [ "transform", "#SVGImage1", "translateY", '229.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 10982, duration: 250, easing: "easeOutSine" },
            { id: "eid305", tween: [ "transform", "#SVGImage1", "translateY", '191.79996px', { valueTemplate: undefined, fromValue: '229.79996px'}], position: 11232, duration: 250, easing: "easeInSine" },
            { id: "eid306", tween: [ "transform", "#SVGImage1", "translateY", '162.79996px', { valueTemplate: undefined, fromValue: '191.79996px'}], position: 11482, duration: 250, easing: "easeOutSine" },
            { id: "eid85", tween: [ "transform", "#SVGImage1", "originX", '50%', { valueTemplate: undefined, fromValue: '50%'}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid105", tween: [ "transform", "#SVGImage1", "originX", '50%', { valueTemplate: undefined, fromValue: '50%'}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid217", tween: [ "style", "#Rectangle2", "height", '27.861237001523px', { valueTemplate: undefined, fromValue: '3px'}], position: 7629, duration: 60, easing: "linear" },
            { id: "eid218", tween: [ "style", "#Rectangle2", "height", '4.5832716200791px', { valueTemplate: undefined, fromValue: '27.861237001523px'}], position: 7689, duration: 60, easing: "linear" },
            { id: "eid219", tween: [ "style", "#Rectangle2", "height", '27.624172005253px', { valueTemplate: undefined, fromValue: '4.5832716200791px'}], position: 7750, duration: 63, easing: "linear" },
            { id: "eid220", tween: [ "style", "#Rectangle2", "height", '2px', { valueTemplate: undefined, fromValue: '27.624172005253px'}], position: 7813, duration: 65, easing: "linear" },
            { id: "eid49", tween: [ "transform", "#SVGImage1", "scaleX", '0.2', { valueTemplate: undefined, fromValue: '1'}], position: 1999, duration: 0, easing: "linear" },
            { id: "eid35", tween: [ "transform", "#SVGImage1", "scaleX", '1.5', { valueTemplate: undefined, fromValue: '0.2'}], position: 2881, duration: 119, easing: "easeInOutQuad" },
            { id: "eid37", tween: [ "transform", "#SVGImage1", "scaleX", '0.8', { valueTemplate: undefined, fromValue: '1.5'}], position: 3001, duration: 53, easing: "easeInOutQuad" },
            { id: "eid39", tween: [ "transform", "#SVGImage1", "scaleX", '1', { valueTemplate: undefined, fromValue: '0.8'}], position: 3054, duration: 196, easing: "easeInOutQuad" },
            { id: "eid91", tween: [ "transform", "#SVGImage1", "scaleX", '2', { valueTemplate: undefined, fromValue: '1'}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid121", tween: [ "transform", "#SVGImage1", "scaleX", '1.6183', { valueTemplate: undefined, fromValue: '2'}], position: 6500, duration: 337, easing: "easeOutQuad" },
            { id: "eid123", tween: [ "transform", "#SVGImage1", "scaleX", '1.5', { valueTemplate: undefined, fromValue: '1.6183'}], position: 6837, duration: 118, easing: "easeInQuad" },
            { id: "eid180", tween: [ "transform", "#SVGImage1", "scaleX", '1.12412', { valueTemplate: undefined, fromValue: '1.5'}], position: 7030, duration: 344, easing: "linear" },
            { id: "eid125", tween: [ "transform", "#SVGImage1", "scaleX", '1', { valueTemplate: undefined, fromValue: '1.12412'}], position: 7374, duration: 125, easing: "easeInQuad" },
            { id: "eid87", tween: [ "style", "#Text4", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 7879, duration: 121, easing: "linear" },
            { id: "eid84", tween: [ "style", "#SVGImage1", "-webkit-transform-origin", [50,100], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,50]}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid397", tween: [ "style", "#SVGImage1", "-moz-transform-origin", [50,100], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,50]}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid398", tween: [ "style", "#SVGImage1", "-ms-transform-origin", [50,100], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,50]}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid399", tween: [ "style", "#SVGImage1", "msTransformOrigin", [50,100], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,50]}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid400", tween: [ "style", "#SVGImage1", "-o-transform-origin", [50,100], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,50]}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid103", tween: [ "style", "#SVGImage1", "-webkit-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,100]}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid401", tween: [ "style", "#SVGImage1", "-moz-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,100]}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid402", tween: [ "style", "#SVGImage1", "-ms-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,100]}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid403", tween: [ "style", "#SVGImage1", "msTransformOrigin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,100]}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid404", tween: [ "style", "#SVGImage1", "-o-transform-origin", [50,50], { valueTemplate: '@@0@@% @@1@@%', fromValue: [50,100]}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid261", tween: [ "transform", "#Text5", "translateY", '3px', { valueTemplate: undefined, fromValue: '-100px'}], position: 8000, duration: 500, easing: "easeOutQuad" },
            { id: "eid67", tween: [ "transform", "#SVGImage1", "translateX", '529.19998px', { valueTemplate: undefined, fromValue: '100px'}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid64", tween: [ "transform", "#SVGImage1", "translateX", '100px', { valueTemplate: undefined, fromValue: '529.19998px'}], position: 4874, duration: 180, easing: "easeOutQuad" },
            { id: "eid287", tween: [ "transform", "#SVGImage1", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 8732, duration: 250, easing: "easeOutSine" },
            { id: "eid289", tween: [ "transform", "#SVGImage1", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 8982, duration: 250, easing: "easeInSine" },
            { id: "eid291", tween: [ "transform", "#SVGImage1", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 9232, duration: 250, easing: "easeOutSine" },
            { id: "eid293", tween: [ "transform", "#SVGImage1", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 9482, duration: 250, easing: "easeInSine" },
            { id: "eid302", tween: [ "transform", "#SVGImage1", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 9732, duration: 250, easing: "easeOutSine" },
            { id: "eid301", tween: [ "transform", "#SVGImage1", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 9982, duration: 250, easing: "easeInSine" },
            { id: "eid300", tween: [ "transform", "#SVGImage1", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 10232, duration: 250, easing: "easeOutSine" },
            { id: "eid299", tween: [ "transform", "#SVGImage1", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 10482, duration: 250, easing: "easeInSine" },
            { id: "eid310", tween: [ "transform", "#SVGImage1", "translateX", '71px', { valueTemplate: undefined, fromValue: '100px'}], position: 10732, duration: 250, easing: "easeOutSine" },
            { id: "eid309", tween: [ "transform", "#SVGImage1", "translateX", '100px', { valueTemplate: undefined, fromValue: '71px'}], position: 10982, duration: 250, easing: "easeInSine" },
            { id: "eid308", tween: [ "transform", "#SVGImage1", "translateX", '130px', { valueTemplate: undefined, fromValue: '100px'}], position: 11232, duration: 250, easing: "easeOutSine" },
            { id: "eid307", tween: [ "transform", "#SVGImage1", "translateX", '100px', { valueTemplate: undefined, fromValue: '130px'}], position: 11482, duration: 250, easing: "easeInSine" },
            { id: "eid48", tween: [ "transform", "#SVGImage1", "scaleY", '0.19999', { valueTemplate: undefined, fromValue: '1'}], position: 1999, duration: 0, easing: "linear" },
            { id: "eid36", tween: [ "transform", "#SVGImage1", "scaleY", '1.5', { valueTemplate: undefined, fromValue: '0.19999'}], position: 2881, duration: 119, easing: "easeInOutQuad" },
            { id: "eid38", tween: [ "transform", "#SVGImage1", "scaleY", '0.8', { valueTemplate: undefined, fromValue: '1.5'}], position: 3001, duration: 53, easing: "easeInOutQuad" },
            { id: "eid40", tween: [ "transform", "#SVGImage1", "scaleY", '1', { valueTemplate: undefined, fromValue: '0.8'}], position: 3054, duration: 196, easing: "easeInOutQuad" },
            { id: "eid92", tween: [ "transform", "#SVGImage1", "scaleY", '2', { valueTemplate: undefined, fromValue: '1'}], position: 6000, duration: 0, easing: "linear" },
            { id: "eid122", tween: [ "transform", "#SVGImage1", "scaleY", '1.77994', { valueTemplate: undefined, fromValue: '2'}], position: 6500, duration: 337, easing: "easeOutQuad" },
            { id: "eid124", tween: [ "transform", "#SVGImage1", "scaleY", '1.34964', { valueTemplate: undefined, fromValue: '1.77994'}], position: 6837, duration: 118, easing: "easeInQuad" },
            { id: "eid181", tween: [ "transform", "#SVGImage1", "scaleY", '1.23', { valueTemplate: undefined, fromValue: '1.34964'}], position: 7030, duration: 344, easing: "linear" },
            { id: "eid126", tween: [ "transform", "#SVGImage1", "scaleY", '0.9', { valueTemplate: undefined, fromValue: '1.23'}], position: 7374, duration: 125, easing: "easeInQuad" },
            { id: "eid162", tween: [ "transform", "#SVGImage1", "scaleY", '1', { valueTemplate: undefined, fromValue: '0.9'}], position: 7500, duration: 129, easing: "linear" },
            { id: "eid239", tween: [ "style", "#Rectangle2", "opacity", '1', { valueTemplate: undefined, fromValue: '0'}], position: 7629, duration: 9, easing: "linear" },
            { id: "eid379", tween: [ "style", "#Rectangle2", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 8000, duration: 0, easing: "linear" },
            { id: "eid52", tween: [ "style", "#Text3", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 5879, duration: 121, easing: "linear" },
            { id: "eid280", tween: [ "style", "#SVGImage2", "opacity", '0.5', { valueTemplate: undefined, fromValue: '0'}], position: 8000, duration: 0, easing: "linear" },
            { id: "eid281", tween: [ "style", "#SVGImage2", "opacity", '0.5', { valueTemplate: undefined, fromValue: '0.5'}], position: 8250, duration: 0, easing: "linear" },
            { id: "eid50", tween: [ "style", "#Text2", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 3879, duration: 121, easing: "linear" },
            { id: "eid20", tween: [ "transform", "#Text1", "translateY", '0px', { valueTemplate: undefined, fromValue: '-100px'}], position: 0, duration: 500, easing: "easeOutQuad" },
            { id: "eid283", tween: [ "style", "#SVGImage3", "opacity", '0', { valueTemplate: undefined, fromValue: '0'}], position: 8000, duration: 0, easing: "linear" },
            { id: "eid282", tween: [ "style", "#SVGImage3", "opacity", '0.25', { valueTemplate: undefined, fromValue: '0'}], position: 8250, duration: 0, easing: "linear" },
            { id: "eid12", tween: [ "style", "#SVGImage1", "opacity", '1', { valueTemplate: undefined, fromValue: '0'}], position: 875, duration: 124, easing: "linear" },
            { id: "eid13", tween: [ "style", "#SVGImage1", "opacity", '0', { valueTemplate: undefined, fromValue: '1'}], position: 2000, duration: 0, easing: "linear" },
            { id: "eid32", tween: [ "style", "#SVGImage1", "opacity", '1', { valueTemplate: undefined, fromValue: '0'}], position: 2881, duration: 369, easing: "easeInOutQuad" },
            { id: "eid51", tween: [ "transform", "#Text3", "translateY", '0px', { valueTemplate: undefined, fromValue: '-100px'}], position: 4000, duration: 500, easing: "easeOutQuad" },
            { id: "eid79", tween: [ "transform", "#SVGImage1", "originY", '50%', { valueTemplate: undefined, fromValue: '50%'}], position: 4000, duration: 0, easing: "linear" },
            { id: "eid106", tween: [ "transform", "#SVGImage1", "originY", '50%', { valueTemplate: undefined, fromValue: '50%'}], position: 6000, duration: 0, easing: "linear" }]
      }
   },
}};

/**
 * Adobe Edge DOM Ready Event Handler
 */
$(window).ready(function() {
     $.Edge.initialize(symbols);
});
/**
 * Adobe Edge Timeline Launch
 */
$(window).load(function() {
    $.Edge.play();
});
