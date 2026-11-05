import 'package:flutter/material.dart';
class AppTheme {
  static ThemeData light = ThemeData(
    useMaterial3: true, scaffoldBackgroundColor: Colors.white,
    colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF111111), brightness: Brightness.light),
    appBarTheme: const AppBarTheme(backgroundColor: Colors.white, foregroundColor: Color(0xFF111111), elevation: 0),
    cardTheme: CardThemeData(color: Colors.white, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14), side: const BorderSide(color: Color(0xFFEAEAEA)))),
  );
}
