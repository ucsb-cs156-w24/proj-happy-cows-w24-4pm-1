package edu.ucsb.cs156.happiercows.errors;

public class CannotSellNegativeException extends Exception {
    public CannotSellNegativeException(String messageString){
        super(messageString);
    }
}
