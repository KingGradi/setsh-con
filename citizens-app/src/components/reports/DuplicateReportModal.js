import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportCard from './ReportCard';

const DuplicateReportModal = ({ 
  visible, 
  onClose, 
  duplicates, 
  onUpvoteExisting, 
  onContinueWithNew,
  onViewExisting,
}) => {
  if (!duplicates || duplicates.length === 0) return null;

  const topDuplicate = duplicates[0];

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${distance}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.round(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="warning" size={24} color="#FF9800" />
            <Text style={styles.headerTitle}>Similar Report Found</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.description}>
            We found a similar report in your area. Consider upvoting the existing report 
            instead of creating a duplicate.
          </Text>

          <View style={styles.duplicateInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {formatDistance(topDuplicate.distance)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {formatDate(topDuplicate.existingReport.created_at)}
              </Text>
            </View>
            
            {topDuplicate.keywordSimilarity > 0 && (
              <View style={styles.infoRow}>
                <Ionicons name="text-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {topDuplicate.keywordSimilarity}% similar content
                </Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Ionicons name="trending-up-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {Math.round(topDuplicate.confidence * 100)}% match confidence
              </Text>
            </View>
          </View>

          <View style={styles.reportContainer}>
            <Text style={styles.sectionTitle}>Existing Report:</Text>
            <TouchableOpacity onPress={() => onViewExisting(topDuplicate.existingReport)}>
              <ReportCard 
                report={topDuplicate.existingReport} 
                onPress={() => {}} 
                showUpvote={true}
                onUpvote={() => {}}
              />
            </TouchableOpacity>
          </View>

          {duplicates.length > 1 && (
            <View style={styles.additionalReports}>
              <Text style={styles.additionalText}>
                + {duplicates.length - 1} other similar report{duplicates.length > 2 ? 's' : ''} nearby
              </Text>
            </View>
          )}

          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>Why this might be a duplicate:</Text>
            {topDuplicate.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.upvoteButton]}
            onPress={() => onUpvoteExisting(topDuplicate.existingReport)}
          >
            <Ionicons name="heart" size={20} color="#fff" />
            <Text style={styles.upvoteButtonText}>Upvote Existing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.continueButton]}
            onPress={onContinueWithNew}
          >
            <Ionicons name="add-circle" size={20} color="#2196F3" />
            <Text style={styles.continueButtonText}>Submit Anyway</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Review & Edit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginVertical: 20,
    textAlign: 'center',
  },
  duplicateInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  reportContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  additionalReports: {
    alignItems: 'center',
    marginBottom: 20,
  },
  additionalText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  reasonsContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  upvoteButton: {
    backgroundColor: '#F44336',
  },
  upvoteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  continueButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'underline',
  },
});

export default DuplicateReportModal;