// High-throughput Java Order Processing Class
public class OrderService {
    public static void main(String[] args) {
        System.out.println("Java Order Processing Microservice Started...");
    }

    public boolean processOrder(String orderId, double amount) {
        System.out.println("Processing order " + orderId + " for amount ₦" + amount);
        return true;
    }
}