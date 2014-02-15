import 'package:angular/angular.dart';
import 'package:dacsslide/presentation.dart';
import 'dart:html' as dom;
import 'dart:math';

main() {
  for (var i = 0; i<30; i++) createStar();
  ngBootstrap(module:new PresentationModule());
}
var rand = new Random();

void createStar() {
  var star = new dom.DivElement();
  star.classes.add("star");
  var top = rand.nextInt(100);
  var size = rand.nextInt(10)+2;
  star.style
    ..top = "$top%"
    ..width = "${size}px"
    ..height = "${size}px"
    ..animationDuration = "${80/size+15}s"
    ..animationDelay = "${rand.nextInt(20)-40}s";
    
  dom.document.body.children.insert(0,star);
}