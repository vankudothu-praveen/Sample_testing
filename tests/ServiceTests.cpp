#include "exceptions/Exceptions.hpp"
#include "repository/InMemoryStudentRepository.hpp"
#include "service/StudentService.hpp"
#include <gtest/gtest.h>
#include <memory>

using namespace studentrecords;

TEST(StudentServiceTests, ValidatesAndManagesRecords) {
    StudentService service(std::make_unique<InMemoryStudentRepository>());
    const Student student("S1", "John", "Doe", "john@example.com", "CS", 1, EnrollmentStatus::Active);
    service.addStudent(student);
    EXPECT_EQ(service.getStudent("S1").firstName(), "John");
    EXPECT_EQ(service.listStudents().size(), 1U);
    service.deleteStudent("S1");
    EXPECT_THROW(service.getStudent("S1"), StudentNotFoundException);
}

TEST(StudentServiceTests, RejectsInvalidRecordBeforeInsert) {
    StudentService service(std::make_unique<InMemoryStudentRepository>());
    const Student student("S1", "John", "Doe", "invalid", "CS", 1, EnrollmentStatus::Active);
    EXPECT_THROW(service.addStudent(student), ValidationException);
    EXPECT_TRUE(service.listStudents().empty());
}
