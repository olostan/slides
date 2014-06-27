import 'package:angular/angular.dart';
import 'package:angular/application_factory_static.dart';
import 'package:dacsslide/presentation.dart';
import 'mobile_webapps_static_expressions.dart' as generated_static_expressions;
import 'mobile_webapps_static_metadata.dart' as generated_static_metadata;
import 'mobile_webapps_static_injector.dart' as generated_static_injector;

main() => staticApplicationFactory(generated_static_injector.factories, generated_static_metadata.typeAnnotations, generated_static_expressions.getters, generated_static_expressions.setters, generated_static_expressions.symbols)
  .addModule(new PresentationModule())
  .run();
