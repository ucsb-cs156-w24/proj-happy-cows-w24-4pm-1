package edu.ucsb.cs156.happiercows.jobs;



import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import java.util.Optional;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import lombok.Getter;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SetCowHealthJob implements JobContextConsumer {

    private long commonsID;
    private double newCowHealth;

    @Getter
    private CommonsRepository commonsRepository;
    @Getter
    private UserCommonsRepository userCommonsRepository;
    @Getter
    private UserRepository userRepository;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Setting cow health...");

        Optional<Commons> commons = commonsRepository.findById(commonsID);
        Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons.get().getId());

        if (commons.isPresent()) {
            ctx.log("Commons " + commons.get().getName());
        }
        
        for (UserCommons userCommons : allUserCommons) {
            User user = userRepository.findById(userCommons.getUserId()).orElseThrow(()->new RuntimeException("Error calling userRepository.findById(" + userCommons.getUserId() + ")"));
            ctx.log("User: " + user.getFullName() + ", numCows: " + userCommons.getNumOfCows() + ", cowHealth: " + userCommons.getCowHealth());
            ctx.log(" old cow health: " + userCommons.getCowHealth() + ", new cow health: " + newCowHealth);
            userCommons.setCowHealth(newCowHealth);
            userCommonsRepository.save(userCommons);
        }

        ctx.log("Cow health has been set!");
    } 
}
