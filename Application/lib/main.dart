import 'package:flutter/material.dart';
import 'config/app_theme.dart';
import 'screens/home_screen.dart';
void main(){WidgetsFlutterBinding.ensureInitialized();runApp(const RealisticMartApp());}
class RealisticMartApp extends StatelessWidget {const RealisticMartApp({super.key});@override Widget build(BuildContext context)=>MaterialApp(title:'Realistic Mart',debugShowCheckedModeBanner:false,theme:AppTheme.light,home:const HomeScreen());}
