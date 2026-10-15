#include "exceptions/Exceptions.hpp"
#include "repository/InMemoryStudentRepository.hpp"
#include <gtest/gtest.h>

using namespace studentrecords;
namespace {
Student makeStudent(std::string id = "S1", std::string email = "one@example.com") {
    return Student(std::move(id), "Ada", "Lovelace", std::move(email), "Computing", 2, EnrollmentStatus::Active);
}
}

TEST(InMemoryStudentRepositoryTests, SupportsCreateReadUpdateAndDelete) {
    InMemoryStudentRepository repo;
    repo.addStudent(makeStudent());
    ASSERT_TRUE(repo.getStudentById("S1").has_value());
    const Student changed("S1", "Ada", "Lovelace", "ada@example.com", "Mathematics", 3, EnrollmentStatus::Graduated);
    repo.updateStudent(changed);
    EXPECT_EQ(repo.getStudentById("S1")->course(), "Mathematics");
    repo.deleteStudent("S1");
    EXPECT_FALSE(repo.getStudentById("S1").has_value());
}

TEST(InMemoryStudentRepositoryTests, RejectsDuplicateIdAndEmail) {
    InMemoryStudentRepository repo;
    repo.addStudent(makeStudent());
    EXPECT_THROW(repo.addStudent(makeStudent()), DuplicateStudentException);
    EXPECT_THROW(repo.addStudent(makeStudent("S2", "one@example.com")), DuplicateStudentException);
}

TEST(InMemoryStudentRepositoryTests, RejectsMissingRecordUpdatesAndDeletes) {
    InMemoryStudentRepository repo;
    EXPECT_THROW(repo.updateStudent(makeStudent()), StudentNotFoundException);
    EXPECT_THROW(repo.deleteStudent("missing"), StudentNotFoundException);
}
